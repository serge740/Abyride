import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private brevoClient: BrevoClient;
  private senderEmail: string;
  private senderName: string;

  constructor() {
    this.brevoClient = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY || '',
    });

    this.senderEmail = process.env.EMAIL_FROM || 'no-reply@abyride.com';
    this.senderName = process.env.EMAIL_FROM_NAME || 'Abyride';

    if (!process.env.BREVO_API_KEY) {
      this.logger.warn(
        'BREVO_API_KEY not set — emails will fail to send until configured',
      );
    }
  }

  async sendRawEmail(
    to: string | string[],
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    if (!to || !subject || !htmlContent) {
      throw new BadRequestException(
        'Email recipient, subject and content are required.',
      );
    }

    const recipients = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];

    const result = await this.brevoClient.transactionalEmails.sendTransacEmail({
      sender: { email: this.senderEmail, name: this.senderName },
      to: recipients,
      subject,
      htmlContent,
    });
    this.logger.log(
      `Email sent to ${Array.isArray(to) ? to.join(', ') : to} - MessageId: ${result.messageId}`,
    );
  }

  async sendWelcomeEmail(options: {
    email: string;
    name: string;
    tempPassword: string;
    role: 'driver' | 'member';
  }): Promise<void> {
    const { email, name, tempPassword, role } = options;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f0f6ff;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f6ff;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(29,78,216,0.12);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%);padding:36px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.15em;color:#bfdbfe;text-transform:uppercase;">Abyride</p>
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Welcome Aboard!</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">Hello <strong>${name}</strong>,</p>
            <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">Your ${role} account has been created. Here are your login credentials:</p>
            <div style="background:#f0f6ff;border:2px solid #bfdbfe;border-radius:10px;padding:20px;margin:0 0 24px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Temporary Password</p>
              <p style="margin:0;font-size:26px;font-weight:700;color:#1e3a8a;letter-spacing:4px;">${tempPassword}</p>
            </div>
            <p style="margin:0 0 20px;font-size:14px;color:#64748b;"><strong style="color:#1e293b;">Important:</strong> Please change your password after your first login.</p>
            <a href="${frontendUrl}${role === 'driver' ? '/driver/login' : '/login'}" style="display:inline-block;background:linear-gradient(135deg,#1e3a8a,#2563eb);color:#ffffff;padding:12px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Sign in</a>
          </td>
        </tr>
        <tr>
          <td style="background:#f0f6ff;padding:20px 32px;border-top:1px solid #bfdbfe;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Abyride · This is an automated message, please do not reply.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await this.sendRawEmail(
      email,
      'Welcome to Abyride — your account is ready',
      html,
    );
  }

  private tripEmailShell(title: string, bodyHtml: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f0f6ff;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f6ff;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(29,78,216,0.12);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%);padding:36px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.15em;color:#bfdbfe;text-transform:uppercase;">Abyride</p>
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">${title}</h1>
          </td>
        </tr>
        <tr><td style="background:#ffffff;padding:32px;">${bodyHtml}</td></tr>
        <tr>
          <td style="background:#f0f6ff;padding:20px 32px;border-top:1px solid #bfdbfe;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">© ${new Date().getFullYear()} Abyride · This is an automated message, please do not reply.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  async sendTripConfirmationEmail(options: {
    email: string;
    name: string;
    pickupAddress: string;
    dropoffAddress: string;
    fare: number;
    scheduledAt?: Date | null;
  }): Promise<void> {
    const { email, name, pickupAddress, dropoffAddress, fare, scheduledAt } = options;
    const when = scheduledAt
      ? `scheduled for <strong>${scheduledAt.toLocaleString('en-US')}</strong>`
      : 'requested for <strong>right now</strong>';

    const body = `
      <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">Hello <strong>${name}</strong>,</p>
      <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">Your ride is ${when}. We'll email you as soon as a driver is assigned.</p>
      <div style="background:#f0f6ff;border:2px solid #bfdbfe;border-radius:10px;padding:20px;margin:0 0 24px;">
        <p style="margin:0 0 10px;font-size:13px;color:#1e293b;"><strong>Pickup:</strong> ${pickupAddress}</p>
        <p style="margin:0 0 10px;font-size:13px;color:#1e293b;"><strong>Dropoff:</strong> ${dropoffAddress}</p>
        <p style="margin:0;font-size:13px;color:#1e293b;"><strong>Fare:</strong> $${fare.toFixed(2)}</p>
      </div>`;

    await this.sendRawEmail(email, 'Your Abyride trip is confirmed', this.tripEmailShell('Trip Confirmed', body));
  }

  async sendTripAssignedEmail(options: { email: string; name: string; driverName: string }): Promise<void> {
    const body = `
      <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">Hello <strong>${options.name}</strong>,</p>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">
        <strong>${options.driverName}</strong> has been assigned to your ride and will be in touch shortly.
      </p>`;
    await this.sendRawEmail(options.email, 'A driver has been assigned to your trip', this.tripEmailShell('Driver Assigned', body));
  }

  async sendTripReminderEmail(options: { email: string; name: string; pickupAddress: string; scheduledAt: Date }): Promise<void> {
    const body = `
      <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">Hello <strong>${options.name}</strong>,</p>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">
        Reminder: your Abyride pickup at <strong>${options.pickupAddress}</strong> is scheduled for
        <strong>${options.scheduledAt.toLocaleString('en-US')}</strong> — about 60 minutes from now.
      </p>`;
    await this.sendRawEmail(options.email, 'Reminder: your Abyride pickup is in 60 minutes', this.tripEmailShell('Upcoming Pickup', body));
  }

  async sendTripCompletedEmail(options: { email: string; name: string; fare: number }): Promise<void> {
    const body = `
      <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">Hello <strong>${options.name}</strong>,</p>
      <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">
        Your trip is complete. Total fare charged: <strong>$${options.fare.toFixed(2)}</strong>. Thanks for riding with Abyride!
      </p>`;
    await this.sendRawEmail(options.email, 'Your Abyride trip is complete', this.tripEmailShell('Trip Completed', body));
  }
}
