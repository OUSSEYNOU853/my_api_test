<?php

namespace App\Repositories\Interfaces;

interface TransactionRepositoryInterface
{
    public function createTransaction(array $transactionData);
    public function getTransactionsByUserId($userId, int $perPage);
}