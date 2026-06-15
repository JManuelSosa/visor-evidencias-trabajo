<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

//* Services
use App\Services\Auth\AuthService;

//* Request
use App\Http\Requests\Auth\AuthRequest;

class LoginController extends Controller
{
    public function __construct(private AuthService $authService){}

    public function create(){
        return inertia('Auth/Login');
    }

    public function authenticate(AuthRequest $request){

        $success = $this->authService->signIn($request->validated());

        if(!$success) {
            return back()->withErrors(["auth" => "Usuario o contraseña incorrectos"])->onlyInput('email');
        }

        $request->session()->regenerate();
        return redirect()->intended('/home');
    }
}
