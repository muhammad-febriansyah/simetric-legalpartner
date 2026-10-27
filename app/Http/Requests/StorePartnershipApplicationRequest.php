<?php

namespace App\Http\Requests;

use App\Models\PartnershipApplication;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePartnershipApplicationRequest extends FormRequest
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
            'full_name' => ['required', 'string', 'max:160'],
            'whatsapp' => ['required', 'string', 'max:32', 'regex:/^\\+?[0-9\\s().-]{8,32}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'partnership_type' => ['required', 'string', Rule::in(array_keys(PartnershipApplication::TYPES))],
            'message' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
