import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Recipient, EmailParams, MailerSend, Sender } from 'mailersend';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly mailersend: MailerSend;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.mailersend = new MailerSend({
            apiKey: this.configService.getOrThrow<string>("MAILER_SEND_API_KEY")
        });
    }
    
    async sendMail({ to, subject, text = '', html = '' }: {
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }) {
        try {
            const recipients = [new Recipient(to, 'Recipient')];
            const sender = new Sender(
                this.configService.getOrThrow<string>("EMAIL_SENDER"),
                'Sender'
            );
            
            const emailParams = new EmailParams()
                .setFrom(sender)
                .setTo(recipients)
                .setSubject(subject)
                .setHtml(html)
                .setText(text);

            await this.mailersend.email.send(emailParams);
        } catch (error) {
            throw error;
        }
    }
}