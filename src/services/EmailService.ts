import EmailRepository from '../repositories/EmailRepository';
import { SendEmailDTO } from "../dto/email/SendEmailDTO";
import sendMailgunEmail from "../util/sendMailgunEmail";
import sendSendgridEmail from "../util/sendSendgridEmail";

export class EmailService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public async sendEmail(sendEmailDTO: SendEmailDTO, senderEmail: string): Promise<void> {
        console.log(`Sending email to ${sendEmailDTO.to}`);
        try {
            const emailCount = await this.emailRepository.getEmailCountForUserToday(senderEmail);
            if (emailCount >= 1000) {
                throw new Error('You have reached the maximum email limit for today');
            }
            await this.emailRepository.createEmail(senderEmail);

            let emailSent = false;
            try {
                await sendMailgunEmail(sendEmailDTO, senderEmail); // Attempt to send via Mailgun
                emailSent = true;
                console.log('Email sent via Mailgun');
            } catch (error) {
                console.log('Mailgun failed, attempting to send via SendGrid...');
            }

            // If Mailgun failed, try SendGrid
            if (!emailSent) {
                try {
                    await sendSendgridEmail(sendEmailDTO, senderEmail); // Attempt to send via SendGrid
                    console.log('Email sent via SendGrid');
                } catch (error) {
                    console.error('Both Mailgun and SendGrid failed to send the email');
                    // Throw an error only after both services have failed.
                    throw new Error('Failed to send email via both Mailgun and SendGrid');
                }
            }

            console.log(`Email saved to database for ${sendEmailDTO.to}`);
        } catch (error) {
            console.error('Error handling email sending:', error);
            throw error;
        }
    }
}

export default new EmailService(new EmailRepository());
