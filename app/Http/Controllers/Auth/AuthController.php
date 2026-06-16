<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

//* Services
use App\Services\Auth\AuthService;
use App\Services\UseCases\RegisterUseCase;

//* Request
use App\Http\Requests\Auth\AuthRequest;
use App\Http\Requests\Auth\RegisterRequest;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService,
        private RegisterUseCase $registerUseCase
    ){}

    public function loginView(){
        return inertia('Auth/Login');
    }

    public function registerView(){
        return inertia('Auth/Register');
    }

    public function signIn(AuthRequest $request){

        $success = $this->authService->signIn($request->validated());

        if(!$success) {
            return back()->withErrors(["auth" => "Usuario o contraseña incorrectos"])->onlyInput('email');
        }

        $request->session()->regenerate();
        return redirect()->intended('/home');
    }

    public function register(RegisterRequest $request) {

        // Ejecutar caso de uso
        $result = $this->registerUseCase->registerNewUser($request->validated());

        // Autenticar
        Auth::login($result->newUser);

        return redirect()->intended('/home');
    }
}
