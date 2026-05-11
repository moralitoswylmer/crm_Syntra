<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $table = 'tenants';

    protected $primaryKey = 'id_tenants';

    public $timestamps = false;

    protected $fillable = [
        'nombre_tenants',
        'nit_tenants',
        'email_tenants',
        'telefono_tenants',
        'plan_tenants',
        'estado_tenants',
        'created_at_tenants',
    ];

    protected function casts(): array
    {
        return [
            'estado_tenants' => 'boolean',
            'created_at_tenants' => 'datetime',
        ];
    }

    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class, 'id_tenants', 'id_tenants');
    }
}
