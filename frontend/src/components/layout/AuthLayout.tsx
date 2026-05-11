import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-badge">Syntra</div>
        <header className="auth-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        {children}

        <footer className="auth-footer">{footer}</footer>
      </section>

      <aside className="auth-showcase">
        <div className="auth-showcase__content">
          <span className="auth-showcase__eyebrow">CRM + ERP SaaS</span>
          <h2>Tu operación comercial empieza con una autenticación sólida.</h2>
          <p>
            Syntra nace con una base limpia para crecer luego hacia clientes, ventas,
            inventario, facturación y automatizaciones con n8n.
          </p>
        </div>
      </aside>
    </main>
  );
}
