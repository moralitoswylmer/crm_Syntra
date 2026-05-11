import { Button, Form } from '@base-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthLayout } from '../../../components/layout/AuthLayout';
import { TextField } from '../../../components/ui/TextField';
import { ApiError, forgotPassword } from '../api/authApi';
import type { ApiValidationErrors, ForgotPasswordPayload } from '../types';

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<ApiValidationErrors>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSubmit = async (values: ForgotPasswordPayload) => {
    setIsSubmitting(true);
    setFormErrors({});
    setFeedbackMessage(null);

    try {
      const response = await forgotPassword(values);
      setFeedbackMessage(response.message);
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrors(error.errors);
        setFeedbackMessage(error.message);
      } else {
        setFeedbackMessage('No pudimos procesar tu solicitud en este momento.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Recupera tu acceso"
      subtitle="Te enviaremos un enlace al correo registrado para restablecer tu contraseña."
      footer={
        <>
          <span>¿Recordaste tu contraseña?</span>
          <Link to="/login">Volver al inicio de sesión</Link>
        </>
      }
    >
      <Form<ForgotPasswordPayload>
        className="auth-form"
        errors={formErrors}
        onFormSubmit={handleSubmit}
      >
        <TextField
          name="email"
          label="Correo registrado"
          type="email"
          autoComplete="email"
          placeholder="empresa@correo.com"
          required
        />

        {feedbackMessage ? <p className="form-feedback">{feedbackMessage}</p> : null}

        <Button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>
      </Form>
    </AuthLayout>
  );
}
