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
        Schema::create('clientes', function (Blueprint $table): void {
            $table->increments('id_clientes');
            $table->unsignedInteger('id_tenants');
            $table->string('nombre_clientes', 150)->nullable();
            $table->string('email_clientes', 150)->nullable();
            $table->string('telefono_clientes', 50)->nullable();
            $table->string('tipo_clientes', 50)->nullable();
            $table->dateTime('created_at_clientes')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::create('leads', function (Blueprint $table): void {
            $table->increments('id_leads');
            $table->unsignedInteger('id_tenants');
            $table->string('nombre_leads', 150)->nullable();
            $table->string('origen_leads', 100)->nullable();
            $table->string('estado_leads', 50)->nullable();
            $table->decimal('valor_estimado_leads', 18, 2)->nullable();
            $table->dateTime('created_at_leads')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::create('pipelines', function (Blueprint $table): void {
            $table->increments('id_pipelines');
            $table->unsignedInteger('id_tenants');
            $table->string('nombre_pipelines', 100)->nullable();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::create('etapas_pipeline', function (Blueprint $table): void {
            $table->increments('id_etapas_pipeline');
            $table->unsignedInteger('id_pipelines');
            $table->string('nombre_etapas_pipeline', 100)->nullable();
            $table->integer('orden_etapas_pipeline')->nullable();

            $table->foreign('id_pipelines')->references('id_pipelines')->on('pipelines');
        });

        Schema::create('oportunidades', function (Blueprint $table): void {
            $table->increments('id_oportunidades');
            $table->unsignedInteger('id_tenants');
            $table->unsignedInteger('id_clientes')->nullable();
            $table->unsignedInteger('id_etapas_pipeline')->nullable();
            $table->decimal('valor_oportunidades', 18, 2)->nullable();
            $table->string('estado_oportunidades', 50)->nullable();
            $table->date('fecha_cierre_oportunidades')->nullable();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
            $table->foreign('id_clientes')->references('id_clientes')->on('clientes');
            $table->foreign('id_etapas_pipeline')->references('id_etapas_pipeline')->on('etapas_pipeline');
        });

        Schema::create('interacciones', function (Blueprint $table): void {
            $table->increments('id_interacciones');
            $table->unsignedInteger('id_tenants');
            $table->unsignedInteger('id_clientes')->nullable();
            $table->string('tipo_interacciones', 50)->nullable();
            $table->longText('mensaje_interacciones')->nullable();
            $table->dateTime('fecha_interacciones')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
            $table->foreign('id_clientes')->references('id_clientes')->on('clientes');
        });

        Schema::create('categorias', function (Blueprint $table): void {
            $table->increments('id_categorias');
            $table->unsignedInteger('id_tenants');
            $table->string('nombre_categorias', 100)->nullable();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::create('productos', function (Blueprint $table): void {
            $table->increments('id_productos');
            $table->unsignedInteger('id_tenants');
            $table->unsignedInteger('id_categorias')->nullable();
            $table->string('nombre_productos', 150)->nullable();
            $table->decimal('precio_productos', 18, 2)->nullable();
            $table->integer('stock_productos')->nullable();
            $table->integer('stock_min_productos')->nullable();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
            $table->foreign('id_categorias')->references('id_categorias')->on('categorias');
        });

        Schema::create('movimientos_inventario', function (Blueprint $table): void {
            $table->increments('id_movimientos');
            $table->unsignedInteger('id_productos');
            $table->string('tipo_movimientos', 20)->nullable();
            $table->integer('cantidad_movimientos')->nullable();
            $table->dateTime('fecha_movimientos')->useCurrent();

            $table->foreign('id_productos')->references('id_productos')->on('productos');
        });

        Schema::create('facturas', function (Blueprint $table): void {
            $table->increments('id_facturas');
            $table->unsignedInteger('id_tenants');
            $table->unsignedInteger('id_clientes')->nullable();
            $table->decimal('total_facturas', 18, 2)->nullable();
            $table->string('estado_facturas', 50)->nullable();
            $table->dateTime('fecha_facturas')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
            $table->foreign('id_clientes')->references('id_clientes')->on('clientes');
        });

        Schema::create('factura_detalle', function (Blueprint $table): void {
            $table->increments('id_factura_detalle');
            $table->unsignedInteger('id_facturas');
            $table->unsignedInteger('id_productos')->nullable();
            $table->integer('cantidad_detalle')->nullable();
            $table->decimal('precio_detalle', 18, 2)->nullable();

            $table->foreign('id_facturas')->references('id_facturas')->on('facturas');
            $table->foreign('id_productos')->references('id_productos')->on('productos');
        });

        Schema::create('transacciones', function (Blueprint $table): void {
            $table->increments('id_transacciones');
            $table->unsignedInteger('id_tenants');
            $table->string('tipo_transacciones', 50)->nullable();
            $table->decimal('monto_transacciones', 18, 2)->nullable();
            $table->longText('descripcion_transacciones')->nullable();
            $table->dateTime('fecha_transacciones')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::create('eventos', function (Blueprint $table): void {
            $table->increments('id_eventos');
            $table->unsignedInteger('id_tenants');
            $table->string('tipo_eventos', 100)->nullable();
            $table->longText('payload_eventos')->nullable();
            $table->boolean('procesado_eventos')->default(false);
            $table->dateTime('created_at_eventos')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::create('logs_automatizacion', function (Blueprint $table): void {
            $table->increments('id_logs');
            $table->unsignedInteger('id_eventos')->nullable();
            $table->string('estado_logs', 50)->nullable();
            $table->longText('respuesta_logs')->nullable();
            $table->dateTime('fecha_logs')->useCurrent();

            $table->foreign('id_eventos')->references('id_eventos')->on('eventos');
        });

        Schema::create('auditoria', function (Blueprint $table): void {
            $table->increments('id_auditoria');
            $table->unsignedInteger('id_tenants')->nullable();
            $table->unsignedInteger('id_usuarios')->nullable();
            $table->string('accion_auditoria', 100)->nullable();
            $table->string('tabla_afectada', 100)->nullable();
            $table->integer('registro_id')->nullable();
            $table->dateTime('fecha_auditoria')->useCurrent();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
            $table->foreign('id_usuarios')->references('id_usuarios')->on('usuarios');
        });

        Schema::create('configuraciones', function (Blueprint $table): void {
            $table->increments('id_configuraciones');
            $table->unsignedInteger('id_tenants')->nullable();
            $table->string('clave_configuracion', 100)->nullable();
            $table->longText('valor_configuracion')->nullable();

            $table->foreign('id_tenants')->references('id_tenants')->on('tenants');
        });

        Schema::table('clientes', function (Blueprint $table): void {
            $table->index('id_tenants', 'idx_clientes_tenants');
        });

        Schema::table('leads', function (Blueprint $table): void {
            $table->index('id_tenants', 'idx_leads_tenants');
        });

        Schema::table('facturas', function (Blueprint $table): void {
            $table->index('id_tenants', 'idx_facturas_tenants');
        });

        Schema::table('productos', function (Blueprint $table): void {
            $table->index('id_tenants', 'idx_productos_tenants');
        });

        Schema::table('eventos', function (Blueprint $table): void {
            $table->index('id_tenants', 'idx_eventos_tenants');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eventos', function (Blueprint $table): void {
            $table->dropIndex('idx_eventos_tenants');
        });

        Schema::table('productos', function (Blueprint $table): void {
            $table->dropIndex('idx_productos_tenants');
        });

        Schema::table('facturas', function (Blueprint $table): void {
            $table->dropIndex('idx_facturas_tenants');
        });

        Schema::table('leads', function (Blueprint $table): void {
            $table->dropIndex('idx_leads_tenants');
        });

        Schema::table('clientes', function (Blueprint $table): void {
            $table->dropIndex('idx_clientes_tenants');
        });

        Schema::dropIfExists('configuraciones');
        Schema::dropIfExists('auditoria');
        Schema::dropIfExists('logs_automatizacion');
        Schema::dropIfExists('eventos');
        Schema::dropIfExists('transacciones');
        Schema::dropIfExists('factura_detalle');
        Schema::dropIfExists('facturas');
        Schema::dropIfExists('movimientos_inventario');
        Schema::dropIfExists('productos');
        Schema::dropIfExists('categorias');
        Schema::dropIfExists('interacciones');
        Schema::dropIfExists('oportunidades');
        Schema::dropIfExists('etapas_pipeline');
        Schema::dropIfExists('pipelines');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('clientes');
    }
};
