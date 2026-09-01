<?php
namespace App\Traits;

use App\Models\File;
use Illuminate\Support\Facades\Auth;
use App\Enums\FileStatus;

// Tipos
use Illuminate\Validation\Validator;

trait ValidateAttachments {

    protected function attachmentRules(){
        return [
            'files' => ['sometimes', 'array'],
            'files.*.file_id' => ['required', 'integer'],
            'files.*.title' => ['required', 'string', 'max:255'],
            'files.*.description' => ['nullable', 'string', 'max:500'],
            'files.*.sort_order' => ['required', 'integer', 'min:1'],

            'urls' => ['sometimes', 'array'],
            'urls.*.url' => ['required', 'url', 'max:2048'],
            'urls.*.title' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function attachmentMessages(){
        return [
            'files.*.title.required' => 'Uno o más archivos seleccionados no tienen título',
            'files.*.title.string' => 'El título de uno o más archivos seleccionados no tiene un formato válido',
            'files.*.title.max' => 'El título de uno o más archivos supera el límite de :max caracteres',
            'files.*.description.string' => 'La descripción de uno o más archivos seleccionados no tiene un formato válido',
            'files.*.description.max' => 'La descripción de uno o más archivos supera el límite de :max caracteres',
            'files.*.sort_order.required' => 'El orden de uno o más archivos es requerido',
            'files.*.sort_order.integer' => 'El orden de uno o más archivos no tiene un formato válido',
            'files.*.sort_order.min' => 'El orden mínimo que debe tener uno o mas archivos es de :min',
            'urls.*.url.url' => 'Una o más URLs proporcionadas no tienen un formato válido.',
            'urls.*.url.required' => 'Una o más URLs proporcionadas no tienen enlace.',
            'urls.*.url.max' => 'Una o más URLs no puede ser mas largo que :max caracteres.',
            'urls.*.title.string' => 'El título de la URL no tiene un formato válido',
            'urls.*.title.max' => 'El titulo de una o más urls no debe ser mayor a :max caracteres'
        ];
    }


    public function validateAttachmentOwnership(Validator $validator) {

        // Validamos que los archivos y ID's enviados en por el frontend efectivamente pertenezcan a registros en la BD hechos por el usuario
        $validator->after(function ($validator){

            $fileIds = collect($this->input('files', []))->pluck('file_id')->filter()->unique()->values();

            if($fileIds->isEmpty()) return;

            $validFilesCount = File::whereIn('id', $fileIds)
            ->where('uploaded_by', Auth::id())
            ->where('file_status', FileStatus::Pending)
            ->count();

            if($validFilesCount !== $fileIds->count()){
                $validator->errors()->add('files', 'Uno o más archivos adjuntos no son válidos');
            }
        });
    }
}
