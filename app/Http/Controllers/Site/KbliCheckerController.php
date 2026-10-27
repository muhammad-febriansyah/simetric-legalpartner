<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\KbliCode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Response;

class KbliCheckerController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:160'],
            'kode' => ['nullable', 'string', 'max:10', 'regex:/^[a-zA-Z0-9. -]*$/'],
            'kategori' => ['nullable', 'string', 'size:1', 'regex:/^[A-V]$/i'],
        ]);

        $query = trim($validated['q'] ?? '');
        $oldCode = strtoupper(trim($validated['kode'] ?? ''));
        $category = strtoupper($validated['kategori'] ?? '');
        $sections = Cache::remember('kbli:source:sections', 14400, function (): array {
            $payload = $this->sourceGet('/api/tools/kbli', []);

            return is_array($payload['sections'] ?? null) ? $payload['sections'] : [];
        });
        $hasData = $sections !== [] || KbliCode::query()->exists();
        $results = collect();
        $conversion = null;

        if ($oldCode !== '') {
            $payload = $this->sourceGet('/api/tools/kbli/konversi', [
                'kode' => $oldCode,
                'arah' => '2020-2025',
            ]);

            if (is_array($payload) && ($payload['ditemukan'] ?? false)) {
                $sourceResults = collect($payload['hasil'] ?? []);
                $conversion = [
                    'source' => [
                        'code' => $oldCode,
                        'title' => 'Kode KBLI lama yang dimasukkan',
                    ],
                    'targets' => $sourceResults
                        ->map(fn (array $item): array => [
                            'code' => (string) ($item['kode'] ?? ''),
                            'title' => (string) ($item['judul'] ?? ''),
                            'relation' => $item['relasi'] ?? null,
                            'notes' => $item['catatan'] ?? null,
                        ])
                        ->values()
                        ->all(),
                ];
            } else {
                $source = KbliCode::query()
                    ->where('version', 2020)
                    ->where('code', $oldCode)
                    ->with(['sourceMappings.target' => fn (Builder $builder) => $builder->where('version', 2025)])
                    ->first();

                if ($source !== null) {
                    $conversion = [
                        'source' => ['code' => $source->code, 'title' => $source->title],
                        'targets' => $source->sourceMappings
                            ->filter(fn ($mapping): bool => $mapping->target !== null)
                            ->map(fn ($mapping): array => [
                                'code' => $mapping->target->code,
                                'title' => $mapping->target->title,
                                'relation' => $mapping->relation_type,
                                'notes' => $mapping->notes,
                            ])
                            ->values()
                            ->all(),
                    ];
                }
            }
        }

        $terms = collect(preg_split('/\s+/u', mb_strtolower($query)) ?: [])
            ->reject(fn (string $term): bool => in_array($term, ['dan', 'atau', 'dengan', 'untuk', 'dari', 'yang', 'pada', 'secara', 'usaha', 'bisnis'], true))
            ->filter(fn (string $term): bool => mb_strlen($term) >= 2)
            ->unique()
            ->take(8);

        if ($terms->isNotEmpty() || $category !== '') {
            $remoteResults = collect();

            foreach ($terms->isNotEmpty() ? $terms : collect(['']) as $term) {
                $payload = $this->sourceGet('/api/tools/kbli', array_filter([
                    'q' => $term !== '' ? $term : null,
                    'section' => $category !== '' ? $category : null,
                ]));

                $remoteResults = $remoteResults->concat($payload['results'] ?? []);
            }

            $results = $remoteResults
                ->filter(fn (array $item): bool => isset($item['code'], $item['title']))
                ->unique('code')
                ->map(fn (array $item): array => [
                    'code' => (string) $item['code'],
                    'title' => (string) $item['title'],
                    'category' => $item['category'] ?? null,
                    'section' => $item['section'] ?? null,
                    'matchedTerms' => $terms->filter(fn (string $term): bool => str_contains(mb_strtolower($item['title']), $term))->values()->all(),
                    'previousCodes' => [],
                ])
                ->sortByDesc(fn (array $result): int => count($result['matchedTerms']))
                ->take(30)
                ->values();

            if ($results->isEmpty() && ! $hasData) {
                $codes = KbliCode::query()
                    ->where('version', 2025)
                    ->when($category !== '', fn (Builder $builder) => $builder->where('code', 'like', $category.'%'))
                    ->when($terms->isNotEmpty(), function (Builder $builder) use ($terms): void {
                        $builder->where(function (Builder $nested) use ($terms): void {
                            foreach ($terms as $term) {
                                $pattern = '%'.addcslashes($term, '%_\\').'%';
                                $nested->orWhere('title', 'like', $pattern)
                                    ->orWhere('description', 'like', $pattern)
                                    ->orWhere('search_keywords', 'like', $pattern);
                            }
                        });
                    })
                    ->with(['sourceMappings.target' => fn (Builder $builder) => $builder->where('version', 2020)])
                    ->orderBy('code')
                    ->limit(100)
                    ->get();

                $results = $codes->map(fn (KbliCode $code): array => [
                    'code' => $code->code,
                    'title' => $code->title,
                    'description' => $code->description,
                    'category' => null,
                    'section' => null,
                    'matchedTerms' => $terms->filter(fn (string $term): bool => str_contains(mb_strtolower($code->title.' '.($code->description ?? '').' '.($code->search_keywords ?? '')), $term))->values()->all(),
                    'previousCodes' => [],
                ]);
            }
        }

        $hasData = $hasData || $results->isNotEmpty();

        return inertia('public/kbli-checker/index', [
            'query' => $query,
            'oldCode' => $oldCode,
            'category' => $category,
            'categories' => collect(range('A', 'V'))->map(fn (string $letter): array => [
                'value' => $letter,
                'label' => 'Kategori '.$letter.' · '.($sections[$letter] ?? ''),
            ])->all(),
            'hasData' => $hasData,
            'results' => $results->all(),
            'conversion' => $conversion,
            'hasSearched' => $query !== '' || $category !== '' || $oldCode !== '',
        ]);
    }

    /** @param array<string, string> $query @return array<string, mixed>|null */
    private function sourceGet(string $path, array $query): ?array
    {
        $cacheKey = 'kbli:source:'.md5($path.'?'.http_build_query($query));

        return Cache::remember($cacheKey, 900, function () use ($path, $query): ?array {
            try {
                $response = Http::acceptJson()
                    ->connectTimeout(3)
                    ->timeout(8)
                    ->get('https://api.ijincepat.id'.$path, $query);

                return $response->successful() ? $response->json() : null;
            } catch (ConnectionException) {
                return null;
            }
        });
    }
}
