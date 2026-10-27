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
        Schema::create('kbli_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_kbli_id')->constrained('kbli_codes')->restrictOnDelete();
            $table->foreignId('target_kbli_id')->constrained('kbli_codes')->restrictOnDelete();
            $table->string('relation_type', 50)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['source_kbli_id', 'target_kbli_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kbli_mappings');
    }
};
