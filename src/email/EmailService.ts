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
            } catch (error) {
                console.error('Mailgun failed to send the email');
            }

            if (!emailSent) {
                try {
                    await sendSendgridEmail(sendEmailDTO, senderEmail);
                } catch (error) {
                    throw new Error('Failed to send email via both Mailgun and SendGrid');
                }
            }

        } catch (error) {
            throw error;
        }
    }
}

export default new EmailService(new EmailRepository());
