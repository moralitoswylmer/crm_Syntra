import { Button, Form } from '@base-ui/react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthLayout } from '../../../components/layout/AuthLayout';
import { TextField } from '../../../components/ui/TextField';
import { ApiError, resetPassword } from '../api/authApi';
import type { ApiValidationErrors, ResetPasswordPayload } from '../types';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<ApiValidationErrors>({});
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const isInvalidLink = useMemo(() => token.length === 0 || email.length === 0, [email, token]);

  const handleSubmit = async (values: Omit<ResetPasswordPayload, 'token' | 'email'>) => {
    if (isInvalidLink) {
      setFeedbackMessage('El enlace no es válido o está incompleto.');
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setFeedbackMessage(null);

    try {
      const response = await resetPassword({
        ...values,
        email,
        token,
      });

      navigate('/login', {
        replace: true,
        state: { message: response.message },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrors(error.errors);
        setFeedbackMessage(error.message);
      } else {
        setFeedbackMessage('No pudimos restablecer tu contraseña en este momento.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Define una nueva contraseña"
      subtitle="Completa el proceso con una contraseña segura para volver a entrar a Syntra."
      footer={
        <>
          <span>¿Prefieres volver?</span>
          <Link to="/login">Ir al login</Link>
        </>
      }
    >
      {isInvalidLink ? (
        <div className="empty-state">
          <p>El enlace de recuperación no contiene la información necesaria.</p>
          <Link to="/olvide-mi-contrasena" className="inline-link">
            Solicitar un nuevo enlace
          </Link>
        </div>
      ) : (
        <Form<Omit<ResetPasswordPayload, 'token' | 'email'>>
          className="auth-form"
          errors={formErrors}
          onFormSubmit={handleSubmit}
        >
          <input name="email" type="hidden" value={email} readOnly />
          <input name="token" type="hidden" value={token} readOnly />

          <TextField
            name="password"
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="Crea una nueva contraseña"
            required
          />
          <TextField
            name="password_confirmation"
            label="Confirmar nueva contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="Repite tu nueva contraseña"
            required
          />

          <p className="field__description">Restableciendo acceso para: {email}</p>

          {feedbackMessage ? <p className="form-feedback">{feedbackMessage}</p> : null}

          <Button className="button button--primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </Form>
      )}
    </AuthLayout>
  );
}
