<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;

Route::get('/', function () {
    return view('welcome');
});


//* Rutas públicas
Route::middleware('guest')->group(function() {
    Route::get('/login', [AuthController::class, 'loginView'])->name('login');
    Route::post('/login', [AuthController::class, 'signIn']);
    Route::get('/register', [AuthController::class, 'registerView'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function() {

    Route::prefix('/email')->group(function() {
        // 1. La vista del aviso: "Revisa tu bandeja de entrada"
        Route::get('/verify', [EmailVerificationController::class, 'showNotice'])->name('verification.notice');

        // 2. LA RUTA FALTANTE: El enlace seguro que llega en el correo
        Route::get('/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->middleware(['signed'])->name('verification.verify');

        // 3. El endpoint para el botón de "Reenviar correo"
        Route::post('verification-notification', [EmailVerificationController::class, 'resend'])->middleware(['throttle:6,1'])->name('verification.send');
    });

    Route::post('/logout', function (\Illuminate\Http\Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    })->name('logout');

    Route::middleware('verified')->group(function() {
        Route::get('/home', function() {
            return Inertia::render('App/Home');
        })->name('home');
    });

});


