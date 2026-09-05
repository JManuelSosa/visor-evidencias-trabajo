<?php
namespace App\Services\FileStorage;

use App\Models\File;
use App\Enums\FileStatus;
use InvalidArgumentException;

class FileService {

    public function createFile(array $data):File {
        return File::create($data);
    }

    public function syncManyFileStatus(array $ids):void {
        File::whereIn('id', $ids)->update(["file_status" => FileStatus::Published->value]);
    }

    public function prepareDataForCreate(array $data):array {

        $requiredFields = [
            "filename" => ["errorLabel" => "Nombre del archivo"],
            "storage_path" => ["errorLabel" => "Path del archivo"],
            "file_size_bytes" => ["errorLabel" => "Tamaño del archivo"],
            "mime_type" => ["errorLabel" => "Tipo MIME"],
            "file_type" => ["errorLabel" => "Tipo de archivo"],
        ];

        foreach($requiredFields as $field => $errorLabel) {

            $label = $errorLabel['errorLabel'];

            if(!isset($data[$field])){
                throw new InvalidArgumentException("Falta el campo requerido o es nulo: {$label}");
            }
        }

        return [
            'filename' => $data['filename'],
            'storage_path' => $data['storage_path'],
            'file_size_bytes' => $data['file_size_bytes'],
            'mime_type' => $data['mime_type'],
            'file_type' => $data['file_type'],
            'uploaded_by' => $data['uploaded_by'] ?? null,
            'file_status' => $data['file_status'] ?? FileStatus::Pending->value,
        ];
    }

    public static function getFileType(string $mimeType):string {
        if (empty($mimeType) || !str_contains($mimeType, '/')) {
            throw new InvalidArgumentException('No se ha enviado un tipo MIME válido');
        }
        return explode('/', $mimeType)[0];
    }
}
