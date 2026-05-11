import { Button, Form } from '@base-ui/react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthLayout } from '../../../components/layout/AuthLayout';
import { TextField } from '../../../components/ui/TextField';
import { ApiError } from '../api/authApi';
import type { ApiValidationErrors, LoginPayload } from '../types';
import { useAuth } from '../../../app/providers/AuthProvider';

interface LocationState {
  message?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<ApiValidationErrors>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(
    (location.state as LocationState | null)?.message ?? null,
  );

  const handleSubmit = async (values: LoginPayload) => {
    setIsSubmitting(true);
    setFormErrors({});
    setFeedbackMessage(null);

    try {
      await login(values);
      navigate('/app', { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrors(error.errors);
        setFeedbackMessage(error.message);
      } else {
        setFeedbackMessage('No fue posible iniciar sesión en este momento.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Accede a Syntra con tu correo y contraseña."
      footer={
        <>
          <span>¿Aún no tienes cuenta?</span>
          <Link to="/registro">Crear cuenta</Link>
        </>
      }
    >
      <Form<LoginPayload>
        className="auth-form"
        errors={formErrors}
        onFormSubmit={handleSubmit}
      >
        <TextField
          name="email"
          label="Correo"
          type="email"
          autoComplete="email"
          placeholder="empresa@correo.com"
          required
        />
        <TextField
          name="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          required
        />

        {feedbackMessage ? <p className="form-feedback">{feedbackMessage}</p> : null}

        <Button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Entrar a Syntra'}
        </Button>
      </Form>

      <div className="auth-links">
        <Link to="/olvide-mi-contrasena">Olvidé mi contraseña</Link>
      </div>
    </AuthLayout>
  );
}
