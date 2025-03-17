<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $userData)
    {
        try {
            $user = $this->userRepository->createUser($userData);
            return $user;
        } catch (Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function login(string $email, string $password)
    {
        try {
            $credentials = [
                'email' => $email,
                'password' => $password
            ];

            if (!$token = Auth::attempt($credentials)) {
                throw new Exception('Invalid credentials');
            }

            return $token;
        } catch (Exception $e) {
            Log::error('Login failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
