<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kbli_codes', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('version');
            $table->string('code', 12);
            $table->string('title', 500);
            $table->longText('description')->nullable();
            $table->string('parent_code', 12)->nullable();
            $table->text('search_keywords')->nullable();
            $table->timestamps();

            $table->unique(['version', 'code']);
            $table->index('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kbli_codes');
    }
};
