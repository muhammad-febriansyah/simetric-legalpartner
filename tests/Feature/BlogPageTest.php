<?php

use App\Models\Article;
use Inertia\Testing\AssertableInertia as Assert;

test('blog index lists only published articles that are already live', function () {
    Article::factory()->published()->create(['title' => 'Artikel Terbit']);
    Article::factory()->create(['title' => 'Artikel Draft']);
    Article::factory()->create(['title' => 'Artikel Terjadwal', 'status' => 'published', 'published_at' => now()->addDay()]);

    $this->get(route('blog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/blog/index')
            ->has('articles.data', 1)
            ->where('articles.data.0.title', 'Artikel Terbit'));
});

test('blog index filters by category and search term', function () {
    Article::factory()->published()->create(['title' => 'Cara Daftar Merek', 'category_label' => 'Kekayaan Intelektual']);
    Article::factory()->published()->create(['title' => 'Pajak UMKM', 'category_label' => 'Perpajakan', 'excerpt' => 'Panduan PPh final']);

    $this->get(route('blog.index', ['kategori' => 'Perpajakan']))
        ->assertInertia(fn (Assert $page) => $page->has('articles.data', 1)->where('articles.data.0.title', 'Pajak UMKM'));

    $this->get(route('blog.index', ['q' => 'merek']))
        ->assertInertia(fn (Assert $page) => $page->has('articles.data', 1)->where('articles.data.0.title', 'Cara Daftar Merek'));

    $this->get(route('blog.index'))
        ->assertInertia(fn (Assert $page) => $page->has('categories', 2));
});

test('blog index paginates ten articles per page', function () {
    Article::factory()->published()->count(12)->create();

    $this->get(route('blog.index'))
        ->assertInertia(fn (Assert $page) => $page->has('articles.data', 10)->where('articles.last_page', 2));
});

test('published article page shows content with reading time and related articles', function () {
    $article = Article::factory()->published()->create(['category_label' => 'Perizinan', 'content' => str_repeat('kata ', 450)]);
    Article::factory()->published()->count(2)->create(['category_label' => 'Perizinan']);

    $this->get(route('blog.show', $article->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/blog/show')
            ->where('article.slug', $article->slug)
            ->where('article.readingMinutes', 3)
            ->has('related', 2));
});

test('draft and unknown articles return not found', function () {
    $draft = Article::factory()->create();

    $this->get(route('blog.show', $draft->slug))->assertNotFound();
    $this->get(route('blog.show', 'tidak-ada'))->assertNotFound();
});
