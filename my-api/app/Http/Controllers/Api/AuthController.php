<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Enregistrement d'un nouvel utilisateur
     */
    public function register(UserRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->register($request->validated());

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'user' => new UserResource($user)
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Authentification de l'utilisateur
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $token = $this->authService->login(
                $request->input('email'),
                $request->input('password')
            );

            return response()->json([
                'token' => $token
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Identifiants invalides',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Déconnexion
     */
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
    /**
     * Déconnexion
     */
}
