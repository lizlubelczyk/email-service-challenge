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
        try {
            const senderEmail = req.auth?.payload['https://yourdomain.com/email'] as string;
            const { to, subject, body } = req.body;
            if (!to || !subject || !body) {
                throw new Error('Missing required fields');
            }
            const sendEmailDTO = new SendEmailDTO(to, subject, body);
            await this.emailService.sendEmail(sendEmailDTO, senderEmail);
            res.status(200).send('Email sent successfully');
        } catch (err) {
            const error = err as Error;
            if (error.message === 'You have reached the maximum email limit for today') {
                res.status(429).send('Failed to send email: You have reached the maximum email limit for today');
            } else {
                res.status(500).send('Failed to send email');
            }
        }
    }
}

export default new EmailController(new EmailService(new EmailRepository()));