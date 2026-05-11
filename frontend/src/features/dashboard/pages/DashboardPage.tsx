import { Button } from '@base-ui/react';
import { useState } from 'react';

import { useAuth } from '../../../app/providers/AuthProvider';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const kpiCards = [
  {
    title: 'Ventas del mes',
    value: currencyFormatter.format(184500000),
    trend: '+18.2%',
    tone: 'positive',
    detail: 'frente al mes anterior',
  },
  {
    title: 'Pipeline activo',
    value: currencyFormatter.format(326000000),
    trend: '+24 oportunidades',
    tone: 'neutral',
    detail: 'negocios en seguimiento',
  },
  {
    title: 'Facturación pendiente',
    value: currencyFormatter.format(48750000),
    trend: '12 facturas',
    tone: 'warning',
    detail: 'por cobrar esta semana',
  },
  {
    title: 'Automatizaciones',
    value: '97%',
    trend: '32 flujos activos',
    tone: 'positive',
    detail: 'ejecuciones exitosas',
  },
] as const;

const pipelineColumns = [
  {
    title: 'Nuevo',
    amount: currencyFormatter.format(58000000),
    items: [
      { company: 'Café Aurora', owner: 'Laura P.', value: currencyFormatter.format(12000000) },
      { company: 'Nova Salud', owner: 'Miguel R.', value: currencyFormatter.format(18000000) },
    ],
  },
  {
    title: 'Contactado',
    amount: currencyFormatter.format(94000000),
    items: [
      { company: 'Urban Market', owner: 'Andrés C.', value: currencyFormatter.format(22000000) },
      { company: 'Grupo Delta', owner: 'Laura P.', value: currencyFormatter.format(14000000) },
      { company: 'Astra Legal', owner: 'Valentina S.', value: currencyFormatter.format(9000000) },
    ],
  },
  {
    title: 'Propuesta',
    amount: currencyFormatter.format(106000000),
    items: [
      { company: 'BioTech Hub', owner: 'Miguel R.', value: currencyFormatter.format(46000000) },
      { company: 'Conexión Logística', owner: 'Wilmer M.', value: currencyFormatter.format(31000000) },
    ],
  },
  {
    title: 'Cerrado',
    amount: currencyFormatter.format(68500000),
    items: [
      { company: 'Horizonte SAS', owner: 'Wilmer M.', value: currencyFormatter.format(28500000) },
      { company: 'Bunker Studio', owner: 'Laura P.', value: currencyFormatter.format(40000000) },
    ],
  },
] as const;

const modules = [
  {
    title: 'CRM',
    subtitle: 'Clientes, leads y oportunidades',
    metric: '1.248 contactos',
    detail: 'Seguimiento comercial en tiempo real',
  },
  {
    title: 'ERP',
    subtitle: 'Facturación e inventario',
    metric: '428 SKU activos',
    detail: 'Stock y facturas sincronizadas',
  },
  {
    title: 'Automatización',
    subtitle: 'Mensajes y tareas automáticas',
    metric: '56 reglas',
    detail: 'Integraciones listas para n8n',
  },
  {
    title: 'Analítica',
    subtitle: 'Indicadores y decisiones',
    metric: '12 KPIs',
    detail: 'Lectura ejecutiva del negocio',
  },
] as const;

const monthlyRevenue = [
  { month: 'Ene', value: 45 },
  { month: 'Feb', value: 58 },
  { month: 'Mar', value: 63 },
  { month: 'Abr', value: 74 },
  { month: 'May', value: 82 },
  { month: 'Jun', value: 68 },
] as const;

const inventoryAlerts = [
  { product: 'Licencia POS Pro', stock: 6, minimum: 12, status: 'Crítico' },
  { product: 'Kit onboarding', stock: 15, minimum: 20, status: 'Bajo' },
  { product: 'Servidor edge mini', stock: 8, minimum: 8, status: 'Límite' },
] as const;

const invoices = [
  { id: 'FAC-2301', client: 'Horizonte SAS', amount: currencyFormatter.format(18500000), status: 'Pagada' },
  { id: 'FAC-2302', client: 'BioTech Hub', amount: currencyFormatter.format(12400000), status: 'Pendiente' },
  { id: 'FAC-2303', client: 'Urban Market', amount: currencyFormatter.format(9600000), status: 'En revisión' },
] as const;

const automations = [
  {
    name: 'Seguimiento post-demo',
    channel: 'WhatsApp + email',
    status: 'Activo',
    lastRun: 'Hace 8 min',
  },
  {
    name: 'Recordatorio de factura',
    channel: 'Email',
    status: 'Activo',
    lastRun: 'Hace 21 min',
  },
  {
    name: 'Crear tarea de recontacto',
    channel: 'CRM',
    status: 'Pausado',
    lastRun: 'Hace 2 h',
  },
] as const;

const teamMembers = [
  { name: 'Wilmer M.', role: 'Owner', focus: 'Estrategia comercial' },
  { name: 'Laura P.', role: 'Sales Manager', focus: 'Pipeline y cierre' },
  { name: 'Miguel R.', role: 'Ops Lead', focus: 'Inventario y facturas' },
] as const;

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [isClosingSession, setIsClosingSession] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsClosingSession(true);

    try {
      await logout();
    } finally {
      setIsClosingSession(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__brand">
          <span className="brand-badge">Syntra</span>
          <div>
            <strong>{user.tenant?.name ?? 'Tu empresa'}</strong>
            <small>Plan {user.tenant?.plan ?? 'starter'}</small>
          </div>
        </div>

        <nav className="dashboard-nav">
          <a className="dashboard-nav__item dashboard-nav__item--active" href="#resumen">
            Resumen ejecutivo
          </a>
          <a className="dashboard-nav__item" href="#crm">
            CRM y pipeline
          </a>
          <a className="dashboard-nav__item" href="#erp">
            ERP e inventario
          </a>
          <a className="dashboard-nav__item" href="#automatizacion">
            Automatización
          </a>
          <a className="dashboard-nav__item" href="#equipo">
            Equipo y roles
          </a>
        </nav>

        <section className="dashboard-sidebar__panel">
          <p className="dashboard-sidebar__label">Espacio de trabajo</p>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className="dashboard-chip">{user.roles.join(', ') || 'owner'}</span>
        </section>

        <section className="dashboard-sidebar__panel">
          <p className="dashboard-sidebar__label">Estado de plataforma</p>
          <ul className="dashboard-status-list">
            <li>
              <span className="dashboard-dot dashboard-dot--positive" />
              CRM operativo
            </li>
            <li>
              <span className="dashboard-dot dashboard-dot--positive" />
              Facturación en línea
            </li>
            <li>
              <span className="dashboard-dot dashboard-dot--warning" />
              1 automatización pausada
            </li>
          </ul>
        </section>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-eyebrow">Plataforma SaaS para gestión empresarial</p>
            <h1>Bienvenido a Syntra, {user.name}</h1>
            <p className="dashboard-description">
              Una vista unificada para ventas, operaciones, inventario, facturación y automatización.
            </p>
          </div>

          <div className="dashboard-topbar__actions">
            <Button className="button button--secondary" type="button">
              Exportar reporte
            </Button>
            <Button className="button button--primary" type="button">
              Nueva automatización
            </Button>
            <Button className="button button--secondary" type="button" onClick={handleLogout} disabled={isClosingSession}>
              {isClosingSession ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </Button>
          </div>
        </header>

        <section className="dashboard-kpis" id="resumen">
          {kpiCards.map((card) => (
            <article className="dashboard-stat-card" key={card.title}>
              <div className="dashboard-stat-card__header">
                <span>{card.title}</span>
                <span className={`dashboard-pill dashboard-pill--${card.tone}`}>{card.trend}</span>
              </div>
              <strong>{card.value}</strong>
              <p>{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-section-grid">
          <article className="dashboard-panel dashboard-panel--wide" id="crm">
            <div className="dashboard-panel__header">
              <div>
                <p className="dashboard-panel__eyebrow">CRM</p>
                <h2>Pipeline comercial</h2>
              </div>
              <span className="dashboard-chip">Vista Kanban</span>
            </div>

            <div className="dashboard-kanban">
              {pipelineColumns.map((column) => (
                <section className="dashboard-kanban__column" key={column.title}>
                  <header className="dashboard-kanban__header">
                    <div>
                      <h3>{column.title}</h3>
                      <small>{column.amount}</small>
                    </div>
                    <span>{column.items.length}</span>
                  </header>

                  <div className="dashboard-kanban__cards">
                    {column.items.map((item) => (
                      <article className="dashboard-lead-card" key={`${column.title}-${item.company}`}>
                        <strong>{item.company}</strong>
                        <p>{item.owner}</p>
                        <span>{item.value}</span>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          <article className="dashboard-panel" id="erp">
            <div className="dashboard-panel__header">
              <div>
                <p className="dashboard-panel__eyebrow">Módulos</p>
                <h2>Vista integral</h2>
              </div>
            </div>

            <div className="dashboard-module-list">
              {modules.map((module) => (
                <article className="dashboard-module-card" key={module.title}>
                  <div>
                    <h3>{module.title}</h3>
                    <p>{module.subtitle}</p>
                  </div>
                  <strong>{module.metric}</strong>
                  <small>{module.detail}</small>
                </article>
              ))}
            </div>
          </article>

          <article className="dashboard-panel dashboard-panel--wide">
            <div className="dashboard-panel__header">
              <div>
                <p className="dashboard-panel__eyebrow">Analítica</p>
                <h2>Ingresos y rendimiento</h2>
              </div>
              <span className="dashboard-chip">Últimos 6 meses</span>
            </div>

            <div className="dashboard-chart">
              {monthlyRevenue.map((item) => (
                <div className="dashboard-chart__bar-group" key={item.month}>
                  <div className="dashboard-chart__bar-track">
                    <div className="dashboard-chart__bar" style={{ height: `${item.value}%` }} />
                  </div>
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <p className="dashboard-panel__eyebrow">Inventario</p>
                <h2>Alertas de stock</h2>
              </div>
            </div>

            <div className="dashboard-list">
              {inventoryAlerts.map((alert) => (
                <article className="dashboard-list__item" key={alert.product}>
                  <div>
                    <strong>{alert.product}</strong>
                    <p>
                      Stock: {alert.stock} | Mínimo: {alert.minimum}
                    </p>
                  </div>
                  <span className="dashboard-chip dashboard-chip--ghost">{alert.status}</span>
                </article>
              ))}
            </div>
          </article>

          <article className="dashboard-panel dashboard-panel--wide">
            <div className="dashboard-panel__header">
              <div>
                <p className="dashboard-panel__eyebrow">Facturación</p>
                <h2>Facturas recientes</h2>
              </div>
            </div>

            <div className="dashboard-table">
              <div className="dashboard-table__row dashboard-table__row--head">
                <span>Factura</span>
                <span>Cliente</span>
                <span>Total</span>
                <span>Estado</span>
              </div>
              {invoices.map((invoice) => (
                <div className="dashboard-table__row" key={invoice.id}>
                  <span>{invoice.id}</span>
                  <span>{invoice.client}</span>
                  <span>{invoice.amount}</span>
                  <span>{invoice.status}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel" id="automatizacion">
            <div className="dashboard-panel__header">
              <div>
                <p className="dashboard-panel__eyebrow">Automatización</p>
                <h2>Flujos activos</h2>
              </div>
            </div>

            <div className="dashboard-list">
              {automations.map((automation) => (
                <article className="dashboard-list__item" key={automation.name}>
                  <div>
                    <strong>{automation.name}</strong>
                    <p>{automation.channel}</p>
                  </div>
                  <div className="dashboard-list__meta">
                    <span className="dashboard-chip">{automation.status}</span>
                    <small>{automation.lastRun}</small>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="dashboard-panel" id="equipo">
            <div className="dashboard-panel__header">
              <div>
                <p className="dashboard-panel__eyebrow">Equipo</p>
                <h2>Usuarios y roles</h2>
              </div>
            </div>

            <div className="dashboard-list">
              {teamMembers.map((member) => (
                <article className="dashboard-list__item" key={member.name}>
                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.focus}</p>
                  </div>
                  <span className="dashboard-chip dashboard-chip--ghost">{member.role}</span>
                </article>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
