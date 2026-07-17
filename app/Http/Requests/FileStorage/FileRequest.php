<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

//* Enums
use App\Enums\FolderR2;

class FileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "filename" => ["required", "string", "max:255"],
            "mime_type" => ["required", "string", Rule::in([
                'image/jpeg',
                'image/png',
                'image/webp',
                'application/pdf',
                'video/mp4',
                'video/webm',
                'video/quicktime',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.ms-powerpoint'
            ])],
            "size" => ["required", "integer", "min:1", "max:1073741824"],
            "context" => ["required", "string", Rule::in(FolderR2::values())]
        ];
    }

    public function messages()
    {
        return [
            "filename.required" => "El nombre del archivo es obligatorio",
            "filename.string" => "El nombre del archivo debe ser texto",
            "filename.max" => "El nombre del archivo no puede ser mas largo que :max caracteres",

            "mime_type.required" => "El tipo de archivo es requerido",
            "mime_type.string" => "El tipo de archivo debe ser un texto",
            "mime_type.in" => "El tipo de archivo no esta autorizado para subirse",

            "size.required" => "El tamaño total del archivo es requerido",
            "size.integer" => "El valor del tamaño del archivo debe ser numérico",
            "size.min" => "El tamaño del archivo debe ser de al menos :min bytes",
            "size.max" => "El tamaño del archivo no puede ser ser mayor a 1 GB",

            "context.required" => "La categoria de archivo es requerida (Anuncio, Evidencia de trabajo, etc)",
            "context.string" => "La categoría de archivo debe ser un texto",
            "context.in" => "La categoria del archivo ingresada no esta permitida"
        ];
    }
}
