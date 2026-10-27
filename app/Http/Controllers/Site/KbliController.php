<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\KbliCode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Response;

class KbliController extends Controller
{
    private const PER_PAGE = 20;

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'versi' => ['nullable', 'integer', 'between:2000,2099'],
            'tingkat' => ['nullable', 'in:kategori,golongan-pokok,golongan,subgolongan,kelompok'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $versions = KbliCode::query()
            ->distinct()
            ->orderByDesc('version')
            ->pluck('version')
            ->map(fn (int $version): int => (int) $version)
            ->all();

        $selectedVersion = isset($validated['versi']) && in_array((int) $validated['versi'], $versions, true)
            ? (int) $validated['versi']
            : ($versions[0] ?? null);
        $search = trim($validated['q'] ?? '');
        $level = $validated['tingkat'] ?? '';

        $query = KbliCode::query()
            ->when($selectedVersion !== null, fn (Builder $builder) => $builder->where('version', $selectedVersion))
            ->when($search !== '', function (Builder $builder) use ($search): void {
                $term = '%'.addcslashes($search, '%_\\').'%';

                $builder->where(fn (Builder $nested) => $nested
                    ->where('code', 'like', $term)
                    ->orWhere('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhere('search_keywords', 'like', $term));
            })
            ->when($level !== '', fn (Builder $builder) => $builder->whereRaw('CHAR_LENGTH(code) = ?', [$this->levelLength($level)]))
            ->with([
                'sourceMappings.target:id,version,code,title',
                'targetMappings.source:id,version,code,title',
            ])
            ->orderBy('code');

        /** @var LengthAwarePaginator<KbliCode> $codes */
        $codes = $query
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (KbliCode $code): array => $this->present($code));

        $parentCodes = collect($codes->items())
            ->pluck('parentCode')
            ->filter()
            ->unique()
            ->values();
        $parents = $selectedVersion !== null && $parentCodes->isNotEmpty()
            ? KbliCode::query()
                ->where('version', $selectedVersion)
                ->whereIn('code', $parentCodes)
                ->get(['code', 'title'])
                ->keyBy('code')
            : collect();

        $codes->through(function (array $code) use ($parents): array {
            $code['parent'] = $code['parentCode'] !== null && $parents->has($code['parentCode'])
                ? ['code' => $code['parentCode'], 'title' => $parents[$code['parentCode']]->title]
                : null;

            return $code;
        });

        return inertia('public/kbli/index', [
            'codes' => $codes,
            'versions' => $versions,
            'filters' => ['q' => $search, 'versi' => $selectedVersion, 'tingkat' => $level],
            'levels' => [
                ['value' => 'kategori', 'label' => 'Kategori'],
                ['value' => 'golongan-pokok', 'label' => 'Golongan pokok'],
                ['value' => 'golongan', 'label' => 'Golongan'],
                ['value' => 'subgolongan', 'label' => 'Subgolongan'],
                ['value' => 'kelompok', 'label' => 'Kelompok usaha'],
            ],
        ]);
    }

    /**
     * @return array{version: int, code: string, title: string, description: ?string, parentCode: ?string, keywords: ?string, mappings: list<array{version: int, code: string, title: string, relation: ?string, notes: ?string}>}
     */
    private function present(KbliCode $code): array
    {
        $mappings = $code->sourceMappings
            ->map(fn ($mapping): array => [
                'version' => $mapping->target->version,
                'code' => $mapping->target->code,
                'title' => $mapping->target->title,
                'relation' => $mapping->relation_type,
                'notes' => $mapping->notes,
            ])
            ->merge($code->targetMappings->map(fn ($mapping): array => [
                'version' => $mapping->source->version,
                'code' => $mapping->source->code,
                'title' => $mapping->source->title,
                'relation' => $mapping->relation_type,
                'notes' => $mapping->notes,
            ]))
            ->unique(fn (array $mapping): string => $mapping['version'].'-'.$mapping['code'])
            ->values()
            ->all();

        return [
            'version' => $code->version,
            'code' => $code->code,
            'title' => $code->title,
            'description' => $code->description,
            'parentCode' => $code->parent_code,
            'keywords' => $code->search_keywords,
            'mappings' => $mappings,
        ];
    }

    private function levelLength(string $level): int
    {
        return match ($level) {
            'kategori' => 1,
            'golongan-pokok' => 2,
            'golongan' => 3,
            'subgolongan' => 4,
            'kelompok' => 5,
        };
    }
}
