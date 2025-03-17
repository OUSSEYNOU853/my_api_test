<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUsers(int $perPage)
    {
        return $this->userRepository->getAllUsers($perPage);
    }

    public function getUserById($id)
    {
        return $this->userRepository->getUserById($id);
    }

    public function createUser(array $userData)
    {
        try {
            DB::beginTransaction();
            $user = $this->userRepository->createUser($userData);
            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('User creation failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateUser($id, array $userData)
    {
        try {
            DB::beginTransaction();
            $user = $this->userRepository->updateUser($id, $userData);
            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('User update failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteUser($id)
    {
        try {
            DB::beginTransaction();
            $result = $this->userRepository->deleteUser($id);
            DB::commit();
            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('User deletion failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
