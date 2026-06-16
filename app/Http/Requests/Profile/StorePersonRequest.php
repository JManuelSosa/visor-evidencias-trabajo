<?php

namespace App\Http\Requests\Profile;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;


class StorePersonRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:60"],
            "paternal_last_name" => ["required", "string", "max:60"],
            "maternal_last_name" => ["nullable", "string", "max:60"],
            "phone" => ["nullable", "string", "size:10"]
        ];
    }


    public function messages()
    {
        return [
            'name.required' => 'El nombre es obligatorio',
            'name.string' => 'El formato del nombre no es válido',
            'name.max' => 'El maximo de caracteres son :max',
            'paternal_last_name.required' => 'El apellido paterno es obligatorio',
            'paternal_last_name.string' => 'El formato del apellido no es válido',
            'paternal_last_name.max' => 'El maximo de caracteres son :max',
            'maternal_last_name.string' => 'El formato del apellido no es válido',
            'maternal_last_name.max' => 'El maximo de caracteres son :max',
            'phone.string' => 'El formato del número no es válido',
            'phone.size' => 'El numero debe tener exactamente :size caracteres'
        ];
    }
}
