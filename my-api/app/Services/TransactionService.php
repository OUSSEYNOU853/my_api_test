<?php

namespace App\Services;

use App\Repositories\Interfaces\TransactionRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionService
{
    protected $transactionRepository;
    protected $userRepository;

    public function __construct(
        TransactionRepositoryInterface $transactionRepository,
        UserRepositoryInterface $userRepository
    ) {
        $this->transactionRepository = $transactionRepository;
        $this->userRepository = $userRepository;
    }

    public function createTransaction($userId, array $transactionData)
    {
        try {
            // Vérifier que l'utilisateur existe
            $user = $this->userRepository->getUserById($userId);

            DB::beginTransaction();

            $transactionData['user_id'] = $userId;
            $transaction = $this->transactionRepository->createTransaction($transactionData);

            DB::commit();
            return $transaction;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Transaction creation failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getTransactionsByUserId($userId, int $perPage)
    {
        try {
            // Vérifier que l'utilisateur existe
            $this->userRepository->getUserById($userId);

            return $this->transactionRepository->getTransactionsByUserId($userId, $perPage);
        } catch (Exception $e) {
            Log::error('Fetching transactions failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
