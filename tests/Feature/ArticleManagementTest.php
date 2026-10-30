<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open article management', function () {
    $this->get(route('admin.articles.index'))
        ->assertRedirect(route('login'));
});

test('admin can create a published article with generated slug and cover image', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.articles.store'), [
        'title' => 'Panduan Legalitas Usaha',
        'slug' => '',
        'excerpt' => 'Ringkasan panduan untuk pemilik usaha.',
        'content' => "## Persiapan\n\nTulis **informasi** yang sudah diverifikasi.",
        'category_label' => 'Panduan Bisnis',
        'cover_image_file' => UploadedFile::fake()->image('cover.png', 1200, 630),
        'cover_alt' => 'Ilustrasi panduan legalitas usaha',
        'author_name' => 'Admin LegalPartner',
        'status' => 'published',
        'meta_title' => 'Panduan Legalitas Usaha | LegalPartner.ID',
        'meta_description' => 'Ringkasan panduan untuk hasil pencarian.',
    ]);

    $article = Article::query()->firstOrFail();

    $response->assertRedirect(route('admin.articles.edit', $article));
    $this->assertDatabaseHas('articles', [
        'id' => $article->id,
        'slug' => 'panduan-legalitas-usaha',
        'status' => 'published',
    ]);
    expect($article->published_at)->not->toBeNull();
    expect($article->content)->toContain('**informasi**');
    Storage::disk('public')->assertExists($article->cover_image);
});

test('admin can save another article with an existing slug', function () {
    $user = User::factory()->create();
    Article::factory()->create(['slug' => 'panduan-legalitas-usaha']);

    $this->actingAs($user)->post(route('admin.articles.store'), [
        'title' => 'Panduan Legalitas Usaha',
        'slug' => 'panduan-legalitas-usaha',
        'content' => 'Panduan terbaru untuk pemilik usaha.',
        'author_name' => 'Admin LegalPartner',
        'status' => 'draft',
    ])->assertRedirect();

    $this->assertDatabaseHas('articles', [
        'title' => 'Panduan Legalitas Usaha',
        'slug' => 'panduan-legalitas-usaha-2',
    ]);
});

test('admin can update an article and its cover through a multipart post', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $article = Article::factory()->create();
    $existingSlug = $article->slug;

    $this->actingAs($user)->post(route('admin.articles.update', $article), [
        '_method' => 'put',
        'title' => 'Artikel diperbarui',
        'slug' => $existingSlug,
        'content' => 'Isi artikel diperbarui.',
        'cover_image_file' => UploadedFile::fake()->image('cover.png', 1200, 630),
        'author_name' => 'Admin LegalPartner',
        'status' => 'draft',
    ])->assertRedirect(route('admin.articles.edit', $article));

    $article->refresh();
    expect($article->title)->toBe('Artikel diperbarui');
    expect($article->cover_image)->not->toBeNull();
    Storage::disk('public')->assertExists($article->cover_image);
});

test('admin can update and delete an article and its stored cover', function () {
    Storage::fake('public');
    Storage::disk('public')->put('articles/cover.jpg', 'image contents');
    $user = User::factory()->create();
    $article = Article::factory()->published()->create(['cover_image' => 'articles/cover.jpg']);

    $this->actingAs($user)
        ->put(route('admin.articles.update', $article), [
            'title' => 'Panduan yang diperbarui',
            'slug' => 'panduan-yang-diperbarui',
            'excerpt' => 'Ringkasan terbaru.',
            'content' => 'Konten artikel yang diperbarui.',
            'category_label' => 'Panduan Bisnis',
            'cover_alt' => 'Sampul panduan terbaru',
            'author_name' => 'Admin LegalPartner',
            'status' => 'draft',
            'meta_title' => '',
            'meta_description' => '',
        ])
        ->assertRedirect(route('admin.articles.edit', $article));

    $article->refresh();
    expect($article->title)->toBe('Panduan yang diperbarui');
    expect($article->status)->toBe('draft');
    expect($article->published_at)->toBeNull();
    Storage::disk('public')->assertExists('articles/cover.jpg');

    $this->delete(route('admin.articles.destroy', $article))
        ->assertRedirect(route('admin.articles.index'));

    $this->assertDatabaseMissing('articles', ['id' => $article->id]);
    Storage::disk('public')->assertMissing('articles/cover.jpg');
});

test('article list searches title and renders matching results', function () {
    $user = User::factory()->create();
    Article::factory()->create(['title' => 'Panduan Legalitas', 'slug' => 'panduan-legalitas']);
    Article::factory()->create(['title' => 'Catatan Perpajakan', 'slug' => 'catatan-perpajakan']);

    $this->actingAs($user)
        ->get(route('admin.articles.index', ['search' => 'legalitas']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/articles/index')
            ->where('search', 'legalitas')
            ->where('articles.total', 1)
            ->where('articles.data.0.slug', 'panduan-legalitas'),
        );
});

test('article validation rejects missing required fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('admin.articles.create'))
        ->post(route('admin.articles.store'), [])
        ->assertRedirect(route('admin.articles.create'))
        ->assertSessionHasErrors(['title', 'content', 'author_name', 'status']);

    expect(Article::query()->count())->toBe(0);
});
