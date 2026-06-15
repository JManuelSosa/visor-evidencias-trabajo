<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});


//* Rutas públicas
Route::middleware('guest')->group(function() {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'authenticate']);
    Route::get('/register', function(){
        return Inertia::render('Auth/Register');
    });
});

Route::middleware('auth')->group(function() {

    Route::get('/home', function() {
        return Inertia::render('App/Home');
    })->name('home');

    Route::post('/logout', function (\Illuminate\Http\Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    })->name('logout');
});


