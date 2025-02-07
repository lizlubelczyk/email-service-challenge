import { Request, Response } from 'express';
import { EmailService } from './EmailService';
import EmailRepository from "./EmailRepository";
import {SendEmailDTO} from "./dto/SendEmailDTO";  // Import the class, not the instance


class EmailController {
    private emailService: EmailService;

    constructor(emailService: EmailService) {
        this.emailService = emailService;
    }

    public async sendEmail(req: Request, res: Response): Promise<void> {
        console.log('EmailController: sendEmail method called');
        try {
            const senderEmail = req.auth?.payload['https://yourdomain.com/email'] as string;
            const { to, subject, body } = req.body;
            console.log(`EmailController: Request data - to: ${to}, subject: ${subject}, body: ${body}`);
            if (!to || !subject || !body) {
                throw new Error('Missing required fields');
            }
            const sendEmailDTO = new SendEmailDTO(to, subject, body);
            console.log('EmailController: Calling emailService.sendEmail');
            await this.emailService.sendEmail(sendEmailDTO, senderEmail);
            console.log('EmailController: Email sent successfully');
            res.status(200).send('Email sent successfully');
        } catch (err) {
            const error = err as Error;
            console.error('EmailController: Failed to send email', error);
            if (error.message === 'You have reached the maximum email limit for today') {
                res.status(429).send('Failed to send email: You have reached the maximum email limit for today');
            } else {
                res.status(500).send('Failed to send email');
            }
        }
    }
}

export default new EmailController(new EmailService(new EmailRepository()));