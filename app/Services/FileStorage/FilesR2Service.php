<?php
namespace App\Services\FileStorage;
use Illuminate\Support\Facades\Storage;

use Illuminate\Filesystem\AwsS3V3Adapter;
use Illuminate\Support\Str;
use Carbon\Carbon;

class FilesR2Service {

    /**
     * Genera una URL firmada para subir un archivo directamente a R2.
     */
    public function generateTemporaryUploadUrl(string $storagePath, string $mimeType): array {

        /** @var AwsS3V3Adapter $disk */
        $disk = Storage::disk('r2');

        $expiration = Carbon::now()->addHour();

        ['url' => $url, 'headers' => $headers] = $disk->temporaryUploadUrl($storagePath, $expiration, ['ContentType' => $mimeType]);

        return [
            'url' => $url,
            'headers' => $headers
        ];
    }

    public function getStoragePath(array $fileInfo): string {

        $extension = pathinfo($fileInfo['filename'], PATHINFO_EXTENSION);
        $uniqueName = Str::uuid();

        if($extension){
            $uniqueName .= ".".$extension;
        }

        $storagePath = $fileInfo['context'] . "/" . $uniqueName;

        return $storagePath;
    }


}
