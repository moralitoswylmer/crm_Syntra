<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthenticatedUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_usuarios,
            'name' => $this->nombre_usuarios,
            'email' => $this->email_usuarios,
            'isActive' => $this->estado_usuarios,
            'createdAt' => optional($this->created_at_usuarios)?->toIso8601String(),
            'tenant' => $this->tenant ? [
                'id' => $this->tenant->id_tenants,
                'name' => $this->tenant->nombre_tenants,
                'plan' => $this->tenant->plan_tenants,
            ] : null,
            'roles' => $this->roles->pluck('nombre_rol')->values()->all(),
        ];
    }
}
