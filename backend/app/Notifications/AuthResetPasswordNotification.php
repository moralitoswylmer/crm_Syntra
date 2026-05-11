<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AuthResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $token,
        private readonly string $email,
    ) {
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim((string) config('app.frontend_url'), '/');
        $resetUrl = sprintf(
            '%s/reset-password?token=%s&email=%s',
            $frontendUrl,
            urlencode($this->token),
            urlencode($this->email),
        );

        return (new MailMessage)
            ->subject('Restablece tu contraseña de Syntra')
            ->greeting('Hola,')
            ->line('Recibimos una solicitud para restablecer tu contraseña en Syntra.')
            ->action('Restablecer contraseña', $resetUrl)
            ->line('Si no solicitaste este cambio, puedes ignorar este mensaje.');
    }
}
