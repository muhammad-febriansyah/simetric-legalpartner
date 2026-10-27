<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\Storage;

trait CopiesDemoAssets
{
    /**
     * Copy a bundled demo asset into the public disk and return its storage path.
     */
    protected function publishDemoAsset(string $relativePath, string $directory): string
    {
        $source = database_path('seeders/assets/'.$relativePath);
        $target = $directory.'/'.basename($relativePath);
        $disk = Storage::disk('public');

        if (! $disk->exists($target) || $disk->size($target) !== filesize($source)) {
            $disk->put($target, file_get_contents($source));
        }

        return $target;
    }
}
