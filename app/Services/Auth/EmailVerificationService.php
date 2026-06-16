<?php
namespace App\Services\Auth;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

class EmailVerificationService {

    /**
     * Marca el correo del usuario como verificado.
     */
    public function verifyEmail(EmailVerificationRequest $request):void {
        $request->fulfill();
    }

    /**
     * Reenvía la notificación de verificación si el usuario no está verificado.
     */
    public function resendVerification(Request $request):bool {
        $user = $request->user();

        if($user->hasVerifiedEmail()) return false;

        $user->sendEmailVerificationNotification();
        return true;
    }
}
