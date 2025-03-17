<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    // Dans UserRepository
    public function getAllUsers(int $perPage = 10)
    {
        return Cache::remember('users.all.' . $perPage, 60, function () use ($perPage) {
            return $this->model->paginate($perPage);
        });
    }

    public function getUserById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function deleteUser($id)
    {
        $user = $this->getUserById($id);
        return $user->delete();
    }

    public function createUser(array $userData)
    {
        $userData['password'] = Hash::make($userData['password']);
        return $this->model->create($userData);
    }

    public function updateUser($id, array $userData)
    {
        $user = $this->getUserById($id);

        if (isset($userData['password'])) {
            $userData['password'] = Hash::make($userData['password']);
        }

        $user->update($userData);
        return $user;
    }

    public function findByEmail(string $email)
    {
        return $this->model->where('email', $email)->first();
    }
}
