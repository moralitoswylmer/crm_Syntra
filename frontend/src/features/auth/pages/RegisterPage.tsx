import { Button, Form } from '@base-ui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../app/providers/AuthProvider';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { TextField } from '../../../components/ui/TextField';
import { ApiError } from '../api/authApi';
import type { ApiValidationErrors, RegisterPayload } from '../types';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<ApiValidationErrors>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSubmit = async (values: RegisterPayload) => {
    setIsSubmitting(true);
    setFormErrors({});
    setFeedbackMessage(null);

    try {
      await register(values);
      navigate('/app', { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrors(error.errors);
        setFeedbackMessage(error.message);
      } else {
        setFeedbackMessage('No pudimos crear tu cuenta en este momento.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Registra tu empresa y el usuario administrador inicial de Syntra."
      footer={
        <>
          <span>¿Ya tienes cuenta?</span>
          <Link to="/login">Iniciar sesión</Link>
        </>
      }
    >
      <Form<RegisterPayload>
        className="auth-form"
        errors={formErrors}
        onFormSubmit={handleSubmit}
      >
        <TextField
          name="tenant_name"
          label="Empresa"
          autoComplete="organization"
          placeholder="Nombre de tu empresa"
          required
        />
        <TextField
          name="name"
          label="Nombre del administrador"
          autoComplete="name"
          placeholder="Tu nombre"
          required
        />
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
          autoComplete="new-password"
          placeholder="Crea una contraseña segura"
          required
        />
        <TextField
          name="password_confirmation"
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          required
        />

        {feedbackMessage ? <p className="form-feedback">{feedbackMessage}</p> : null}

        <Button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </Form>
    </AuthLayout>
  );
}
