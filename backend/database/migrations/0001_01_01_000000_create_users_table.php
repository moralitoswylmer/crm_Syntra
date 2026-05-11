<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table): void {
            $table->increments('id_tenants');
            $table->string('nombre_tenants', 150);
            $table->string('nit_tenants', 50)->nullable();
            $table->string('email_tenants', 150)->nullable();
            $table->string('telefono_tenants', 50)->nullable();
            $table->string('plan_tenants', 50)->nullable();
            $table->boolean('estado_tenants')->default(true);
            $table->dateTime('created_at_tenants')->useCurrent();
        });

        Schema::create('roles', function (Blueprint $table): void {
            $table->increments('id_rol');
            $table->string('nombre_rol', 50);
        });

        Schema::create('usuarios', function (Blueprint $table): void {
            $table->increments('id_usuarios');
            $table->unsignedInteger('id_tenants');
            $table->string('nombre_usuarios', 150)->nullable();
            $table->string('email_usuarios', 150)->nullable()->unique();
            $table->longText('password_usuarios')->nullable();
            $table->boolean('estado_usuarios')->default(true);
            $table->dateTime('created_at_usuarios')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::create('usuario_roles', function (Blueprint $table): void {
            $table->unsignedInteger('id_usuarios');
            $table->unsignedInteger('id_rol');

            $table->primary(['id_usuarios', 'id_rol']);
            $table->foreign('id_usuarios')->references('id_usuarios')->on('usuarios');
            $table->foreign('id_rol')->references('id_rol')->on('roles');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table): void {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario_roles');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('usuarios');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('tenants');
    }
};
