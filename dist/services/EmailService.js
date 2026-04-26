"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        if (process.env.NODE_ENV === 'development') {
            this.transporter = nodemailer_1.default.createTransport({
                streamTransport: true,
                newline: 'unix',
                buffer: true
            });
        }
        else {
            this.transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
    }
    async sendPasswordResetEmail(email, resetToken, userName) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'Digital Library'}" <${process.env.EMAIL_FROM || 'noreply@library.com'}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour.<br>
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
            text: `
Hello ${userName},

You requested to reset your password. Click the link below to reset it:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.
      `,
        };
        if (process.env.NODE_ENV === 'development') {
            console.log('\n=== PASSWORD RESET EMAIL ===');
            console.log(`To: ${email}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`\n${mailOptions.text}`);
            console.log('============================\n');
        }
        else {
            await this.transporter.sendMail(mailOptions);
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map