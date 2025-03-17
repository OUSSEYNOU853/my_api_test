<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface
{
    public function getAllUsers(int $perPage);
    public function getUserById($id);
    public function deleteUser($id);
    public function createUser(array $userData);
    public function updateUser($id, array $userData);
    public function findByEmail(string $email);
}