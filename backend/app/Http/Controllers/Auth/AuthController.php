<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\AuthenticatedUserResource;
use App\Models\Rol;
use App\Models\Tenant;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $usuario = DB::transaction(function () use ($validated): Usuario {
            $tenant = Tenant::create([
                'nombre_tenants' => $validated['tenant_name'],
                'email_tenants' => $validated['email'],
                'plan_tenants' => 'starter',
                'estado_tenants' => true,
            ]);

            $usuario = Usuario::create([
                'id_tenants' => $tenant->id_tenants,
                'nombre_usuarios' => $validated['name'],
                'email_usuarios' => $validated['email'],
                'password_usuarios' => $validated['password'],
                'estado_usuarios' => true,
            ]);

            $ownerRole = Rol::firstOrCreate([
                'nombre_rol' => 'owner',
            ]);

            $usuario->roles()->syncWithoutDetaching([$ownerRole->id_rol]);

            return $usuario;
        });

        Auth::guard('web')->login($usuario);
        $request->session()->regenerate();

        return $this->authenticatedResponse(
            $usuario,
            'Tu cuenta de Syntra fue creada correctamente.',
            Response::HTTP_CREATED,
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $credentials = [
            'email_usuarios' => $validated['email'],
            'password' => $validated['password'],
            'estado_usuarios' => true,
        ];

        if (! Auth::guard('web')->attempt($credentials, remember: false)) {
            return response()->json([
                'message' => 'Las credenciales ingresadas no son válidas.',
                'errors' => [
                    'email' => ['Revisa tu correo y contraseña e intenta de nuevo.'],
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $request->session()->regenerate();

        /** @var Usuario $usuario */
        $usuario = Auth::guard('web')->user();

        return $this->authenticatedResponse($usuario, 'Bienvenido de nuevo a Syntra.');
    }

    public function me(Request $request): JsonResponse
    {
        /** @var Usuario $usuario */
        $usuario = $request->user();

        return $this->authenticatedResponse($usuario, 'Sesión activa.');
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    private function authenticatedResponse(Usuario $usuario, string $message, int $status = Response::HTTP_OK): JsonResponse
    {
        $usuario->loadMissing(['tenant', 'roles']);

        return response()->json([
            'message' => $message,
            'user' => new AuthenticatedUserResource($usuario),
        ], $status);
    }
}
