<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Services\Auth\EmailVerificationService;

class EmailVerificationController extends Controller
{
    public function __construct(private EmailVerificationService $verificationService){}

    /**
     * Muestra la vista de advertencia de verificación.
     */
    public function showNotice(Request $request){

        return inertia('Auth/VerifyEmail', [
            'email' => $request->user()->email,
            'message' => session('message')
        ]);
    }

    /**
     * Verificacion del enlace en el correo
     */
    public function verify(EmailVerificationRequest $request){
        $this->verificationService->verifyEmail($request);
        return redirect()->intended('/home');
    }

    /**
     * Proceso de solicitud del reenvío del correo
     */
    public function resend(Request $request){
        $sent = $this->verificationService->resendVerification($request);

        if(!$sent){
            return redirect()->intended('/home');
        }

        return back()->with('message', 'Enlace de verificación enviado');
    }
}
