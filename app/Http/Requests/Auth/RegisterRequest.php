<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

use App\Http\Requests\Auth\AuthRequest;
use App\Http\Requests\Profile\StorePersonRequest;

use Illuminate\Validation\Rule;


class RegisterRequest extends FormRequest
{

    protected AuthRequest $authRequest;
    protected StorePersonRequest $personRequest;

    public function prepareForValidation()
    {
        $this->authRequest = new AuthRequest();
        $this->personRequest = new StorePersonRequest();
    }

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
        $authRules = $this->authRequest->rules();
        $personRules = $this->personRequest->rules();

        $rules = array_merge($authRules, $personRules);

        $rules['email'][] = Rule::unique('users', 'email');

        return $rules;
    }

    public function messages()
    {
        $authMessages = $this->authRequest->messages();
        $personMessages = $this->personRequest->messages();

        $messages = array_merge($authMessages, $personMessages);

        // Agregamos el mensaje de error orientado a la UX
        $messages['email.unique'] = 'Este correo ya tiene una cuenta asociada';

        return $messages;
    }
}
