<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Services\TransactionService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
        // $this->middleware('auth:api');
    }

    /**
     * Créer une nouvelle transaction pour un utilisateur
     */
    public function store(TransactionRequest $request, $userId): JsonResponse
    {
        try {
            $transaction = $this->transactionService->createTransaction(
                $userId,
                $request->validated()
            );

            return response()->json([
                'message' => 'Transaction enregistrée avec succès',
                'transaction' => new TransactionResource($transaction)
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de la transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer toutes les transactions d'un utilisateur
     */
    public function index(Request $request, $userId): JsonResponse
    {
        try {
            $perPage = $request->input('limit', 10);
            $transactions = $this->transactionService->getTransactionsByUserId($userId, $perPage);

            return response()->json([
                'transactions' => TransactionResource::collection($transactions),
                'pagination' => [
                    'total' => $transactions->total(),
                    'per_page' => $transactions->perPage(),
                    'current_page' => $transactions->currentPage(),
                    'last_page' => $transactions->lastPage()
                ]
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
