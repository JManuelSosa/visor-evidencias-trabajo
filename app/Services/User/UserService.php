<?php
namespace App\Services\User;

use App\Models\User;
use App\Enums\RoleSystem;
use App\Models\SystemRole;

class UserService {

    public function createUser(array $data):User {
        return User::create($data);
    }

    public function prepareForCreate(array $data):array {
        return [
            'email' => $data['email'],
            'password' => $data['password'],
            'role_id' => SystemRole::getRoleId(RoleSystem::User),
        ];
    }

}
