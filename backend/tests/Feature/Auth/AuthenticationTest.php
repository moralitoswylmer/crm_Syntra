<?php

namespace Tests\Feature\Auth;

use App\Models\Rol;
use App\Models\Tenant;
use App\Models\Usuario;
use App\Notifications\AuthResetPasswordNotification;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    public function test_user_can_register_and_receive_an_authenticated_profile(): void
    {
        $response = $this
            ->withFrontendHeaders()
            ->postJson('/api/auth/register', [
                'tenant_name' => 'Syntra Labs',
                'name' => 'Wilmer Dev',
                'email' => 'wilmer@example.com',
                'password' => 'Password123!',
                'password_confirmation' => 'Password123!',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.email', 'wilmer@example.com')
            ->assertJsonPath('user.tenant.name', 'Syntra Labs')
            ->assertJsonPath('user.roles.0', 'owner');

        $this->assertDatabaseHas('tenants', [
            'nombre_tenants' => 'Syntra Labs',
        ]);

        $this->assertDatabaseHas('usuarios', [
            'email_usuarios' => 'wilmer@example.com',
        ]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $usuario = $this->createUsuario();

        $response = $this
            ->withFrontendHeaders()
            ->postJson('/api/auth/login', [
                'email' => $usuario->email_usuarios,
                'password' => 'Password123!',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('user.email', $usuario->email_usuarios);
    }

    public function test_authenticated_user_can_fetch_profile(): void
    {
        $usuario = $this->createUsuario();

        $response = $this
            ->actingAs($usuario, 'web')
            ->withFrontendHeaders()
            ->getJson('/api/auth/me');

        $response
            ->assertOk()
            ->assertJsonPath('user.email', $usuario->email_usuarios);
    }

    public function test_registered_email_receives_password_reset_notification(): void
    {
        Notification::fake();

        $usuario = $this->createUsuario();

        $response = $this
            ->withFrontendHeaders()
            ->postJson('/api/auth/forgot-password', [
                'email' => $usuario->email_usuarios,
            ]);

        $response->assertOk();

        Notification::assertSentTo($usuario, AuthResetPasswordNotification::class);
    }

    public function test_user_can_reset_password_with_valid_token(): void
    {
        $usuario = $this->createUsuario();
        $token = Password::broker('usuarios')->createToken($usuario);

        $response = $this
            ->withFrontendHeaders()
            ->postJson('/api/auth/reset-password', [
                'token' => $token,
                'email' => $usuario->email_usuarios,
                'password' => 'NuevaPassword123!',
                'password_confirmation' => 'NuevaPassword123!',
            ]);

        $response->assertOk();

        $usuario->refresh();

        $this->assertTrue(Hash::check('NuevaPassword123!', $usuario->password_usuarios));
    }

    private function createUsuario(): Usuario
    {
        $tenant = Tenant::create([
            'nombre_tenants' => 'Syntra Demo',
            'email_tenants' => 'demo@syntra.test',
            'plan_tenants' => 'starter',
            'estado_tenants' => true,
        ]);

        $role = Rol::create([
            'nombre_rol' => 'owner',
        ]);

        $usuario = Usuario::create([
            'id_tenants' => $tenant->id_tenants,
            'nombre_usuarios' => 'Usuario Demo',
            'email_usuarios' => 'demo@syntra.test',
            'password_usuarios' => 'Password123!',
            'estado_usuarios' => true,
        ]);

        $usuario->roles()->attach($role->id_rol);

        return $usuario;
    }

    private function withFrontendHeaders(): static
    {
        return $this
            ->withHeader('Origin', config('app.frontend_url'))
            ->withHeader('Referer', config('app.frontend_url'));
    }
}
