<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'email' => ['nullable', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'first_name' => 'nullable|string|max:100',
            'first_names' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'initials' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:100',
            'date_of_birth' => 'nullable|date_format:d-m-Y',
            'date_of_death' => 'nullable|date_format:d-m-Y',
        ];
    }
}
