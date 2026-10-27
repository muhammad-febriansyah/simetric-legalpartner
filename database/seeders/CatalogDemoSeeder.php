<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Service;
use App\Models\ServiceAddon;
use App\Models\ServiceCategory;
use App\Models\ServicePackage;
use Database\Seeders\Concerns\CopiesDemoAssets;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogDemoSeeder extends Seeder
{
    use CopiesDemoAssets;

    /**
     * Seed categories, services, packages, add-ons, and FAQs from database/seeders/data/catalog.php.
     */
    public function run(): void
    {
        /** @var array{categories: list<array<string, string>>, services: list<array<string, mixed>>} $catalog */
        $catalog = require database_path('seeders/data/catalog.php');

        $categories = [];

        foreach ($catalog['categories'] as $index => $definition) {
            $categories[$definition['slug']] = ServiceCategory::query()->updateOrCreate(
                ['slug' => $definition['slug']],
                [
                    'name' => $definition['name'],
                    'description' => $definition['description'],
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }

        foreach ($catalog['services'] as $index => $definition) {
            $service = Service::query()->updateOrCreate(
                ['slug' => $definition['slug']],
                [
                    'service_category_id' => $categories[$definition['category']]->id,
                    'name' => $definition['name'],
                    'excerpt' => $definition['excerpt'],
                    'description' => $definition['description'],
                    'hero_image' => $this->publishDemoAsset("services/{$definition['slug']}.jpg", 'services'),
                    'hero_image_alt' => $definition['image_alt'],
                    'requirements' => $definition['requirements'],
                    'process_steps' => $definition['steps'],
                    'duration_label' => $definition['duration'],
                    'meta_title' => $definition['name'].' | LegalPartner.ID',
                    'meta_description' => Str::limit($definition['excerpt'], 160),
                    'is_featured' => $definition['featured'],
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ],
            );

            $this->seedPackages($service, $definition);
            $this->seedAddons($service, $definition['addons']);
            $this->seedFaqs($service, $definition['faqs']);
        }
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function seedPackages(Service $service, array $definition): void
    {
        $slugs = [];

        foreach ($definition['packages'] as $position => [$name, $price, $isPopular, $features]) {
            $slug = Str::slug($name);
            $slugs[] = $slug;

            ServicePackage::query()->updateOrCreate(
                ['service_id' => $service->id, 'slug' => $slug],
                [
                    'name' => $name,
                    'description' => "Paket {$name} untuk layanan {$definition['name']}.",
                    'price' => $price,
                    'price_label' => null,
                    'features' => $features,
                    'is_popular' => $isPopular,
                    'is_active' => true,
                    'sort_order' => $position + 1,
                ],
            );
        }

        ServicePackage::query()
            ->where('service_id', $service->id)
            ->whereNotIn('slug', $slugs)
            ->delete();
    }

    /**
     * @param  list<array{0: string, 1: string, 2: int}>  $addons
     */
    private function seedAddons(Service $service, array $addons): void
    {
        foreach ($addons as $position => [$name, $description, $price]) {
            ServiceAddon::query()->updateOrCreate(
                ['service_id' => $service->id, 'name' => $name],
                [
                    'description' => $description,
                    'price' => $price,
                    'is_active' => true,
                    'sort_order' => $position + 1,
                ],
            );
        }

        ServiceAddon::query()
            ->where('service_id', $service->id)
            ->whereNotIn('name', array_column($addons, 0))
            ->delete();
    }

    /**
     * @param  list<array{0: string, 1: string}>  $faqs
     */
    private function seedFaqs(Service $service, array $faqs): void
    {
        foreach ($faqs as $position => [$question, $answer]) {
            Faq::query()->updateOrCreate(
                ['service_id' => $service->id, 'question' => $question],
                ['answer' => $answer, 'is_active' => true, 'sort_order' => $position + 1],
            );
        }

        Faq::query()
            ->where('service_id', $service->id)
            ->whereNotIn('question', array_column($faqs, 0))
            ->delete();
    }
}
