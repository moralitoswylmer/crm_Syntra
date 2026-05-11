<?php

namespace App\Models;

use App\Notifications\AuthResetPasswordNotification;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable implements CanResetPasswordContract
{
    use CanResetPasswordTrait;
    use HasApiTokens;
    use Notifiable;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuarios';

    public $timestamps = false;

    protected $fillable = [
        'id_tenants',
        'nombre_usuarios',
        'email_usuarios',
        'password_usuarios',
        'estado_usuarios',
        'created_at_usuarios',
    ];

    protected $hidden = [
        'password_usuarios',
    ];

    protected function casts(): array
    {
        return [
            'estado_usuarios' => 'boolean',
            'password_usuarios' => 'hashed',
            'created_at_usuarios' => 'datetime',
        ];
    }

    public function getAuthPassword(): string
    {
        return $this->password_usuarios;
    }

    public function getEmailForPasswordReset(): string
    {
        return $this->email_usuarios;
    }

    public function routeNotificationForMail(): string
    {
        return $this->email_usuarios;
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new AuthResetPasswordNotification($token, $this->email_usuarios));
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenants', 'id_tenants');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Rol::class, 'usuario_roles', 'id_usuarios', 'id_rol');
    }
}
