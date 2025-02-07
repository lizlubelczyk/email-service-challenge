import EmailRepository from './EmailRepository';
import { SendEmailDTO } from "./dto/SendEmailDTO";
import sendMailgunEmail from "./emailProviders/sendMailgunEmail";
import sendSendgridEmail from "./emailProviders/sendSendgridEmail";

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
                await sendMailgunEmail(sendEmailDTO, senderEmail);
                emailSent = true;
                console.log('Email sent via Mailgun');
            } catch (error) {
                console.log('Mailgun failed, attempting to send via SendGrid...');
            }

            if (!emailSent) {
                try {
                    await sendSendgridEmail(sendEmailDTO, senderEmail);
                    console.log('Email sent via SendGrid');
                } catch (error) {
                    console.error('Both Mailgun and SendGrid failed to send the email');
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
