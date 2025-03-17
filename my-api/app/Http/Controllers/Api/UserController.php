<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        // $this->middleware('auth:api')->except(['store']);
    }

    /**
     * Liste des utilisateurs avec pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('limit', 10);
            $users = $this->userService->getAllUsers($perPage);

            return response()->json(new UserCollection($users));
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function store(UserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->createUser($request->validated());

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
     * Récupérer un utilisateur par son ID
     */
    public function show($id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);

            return response()->json(new UserResource($user));
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Utilisateur non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function update(UserRequest $request, $id): JsonResponse
    {
        try {
            $user = $this->userService->updateUser($id, $request->validated());

            return response()->json([
                'message' => 'Utilisateur mis à jour avec succès',
                'user' => new UserResource($user)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->userService->deleteUser($id);

            return response()->json([
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
