<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\Usuario;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Symfony\Component\HttpFoundation\Response;

class PasswordResetController extends Controller
{
    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        Password::broker('usuarios')->sendResetLink([
            'email_usuarios' => $request->string('email')->toString(),
        ]);

        return response()->json([
            'message' => 'Si el correo existe en Syntra, te enviaremos instrucciones para recuperar tu acceso.',
        ], Response::HTTP_OK);
    }

    public function update(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::broker('usuarios')->reset(
            [
                'email_usuarios' => $request->string('email')->toString(),
                'password' => $request->string('password')->toString(),
                'password_confirmation' => $request->string('password_confirmation')->toString(),
                'token' => $request->string('token')->toString(),
            ],
            function (Usuario $usuario, string $password): void {
                $usuario->forceFill([
                    'password_usuarios' => $password,
                ])->save();

                event(new PasswordReset($usuario));
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
                'errors' => [
                    'email' => [__($status)],
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'message' => 'Tu contraseña fue actualizada correctamente.',
        ]);
    }
}
