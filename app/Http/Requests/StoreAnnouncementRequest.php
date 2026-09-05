<?php
namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

use Illuminate\Support\Facades\Auth;
use App\Traits\ValidateAttachments;

class StoreAnnouncementRequest extends FormRequest
{
    use ValidateAttachments;

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
    public function rules(): array {
        return array_merge($this->attachmentRules(),[
            'title' => ['string', 'required', 'max:100'],
            'content' => ['string', 'required', 'max:3000'],
        ]);
    }

    public function messages():array {
        return array_merge($this->attachmentMessages(), [
            'title.string' => 'El titulo del anuncio no tiene un formato válido.',
            'title.required' => 'El titulo del anuncio es requerido. Por favor verifique.',
            'title.max' => 'El título del anuncio no puede tener más de :max caracteres.',
            'content.string' => 'El contenido del anuncio no tiene un formato válido.',
            'content.required' => 'El contenido del anuncio es requerido. Por favor verifique.',
            'content.max' => 'El contenido del anuncio no puede tener más de :max caracteres.'
        ]);
    }

    public function withValidator(Validator $validator){
        $this->validateAttachmentOwnership($validator);
    }
}
