<?php
namespace App\Services\UseCases;

use App\Services\FileStorage\FilesR2Service;
use App\Services\FileStorage\FileService;

class FileUploadUseCase {

    public function __construct(private FilesR2Service $fileR2Service, private FileService $fileService){}

    public function uploadByPresignedUrl(array $data):array {

        $storagePath = $this->fileR2Service->getStoragePath($data);
        $uploadData = $this->fileR2Service->generateTemporaryUploadUrl($storagePath, $data['mime_type']);

        $rawData = [
            ...$data,
            'storage_path' => $storagePath
        ];

        $newFileData = $this->fileService->prepareDataForCreate($rawData);
        $newFile = $this->fileService->createFile($newFileData);

        return [
            "file_id" => $newFile->id,
            "upload_url" => $uploadData['url'],
            "headers" => $uploadData['headers']
        ];
    }

}
