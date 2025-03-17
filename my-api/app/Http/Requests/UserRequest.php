<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('id');
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8'
        ];

        if ($this->isMethod('PUT')) {
            $rules['email'] = 'required|email|max:255|unique:users,email,' . $userId;
            $rules['password'] = 'sometimes|string|min:8';
        }

        return $rules;
    }
}
