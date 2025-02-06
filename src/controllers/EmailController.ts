// src/controllers/EmailController.ts
import { Request, Response } from 'express';
import { EmailService } from '../services/EmailService';
import EmailRepository from "../repositories/EmailRepository";
import {SendEmailDTO} from "../dto/email/SendEmailDTO";  // Import the class, not the instance


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
        } catch (error) {
            console.error('EmailController: Failed to send email', error);
            res.status(500).send('Failed to send email');
        }
    }
}

export default new EmailController(new EmailService(new EmailRepository()));