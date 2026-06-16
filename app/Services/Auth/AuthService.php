<?php
namespace App\Services\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



class AuthService {

    public function signIn(array $credentials) {

        return Auth::attempt([
            "email" => $credentials["email"],
            "password" => $credentials["password"]
        ]);
    }

    public function register(array $data){

    }

}
