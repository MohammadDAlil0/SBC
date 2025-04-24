export function getPasswordResetTemplate(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            padding: 10px 20px; 
            background-color: #2563eb; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 15px 0;
          }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <p>If you didn't request this, please ignore this email.</p>
          <p>The link will expire in 1 hour.</p>
          
          <div class="footer">
            <p>Best regards,<br>Your App Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
}