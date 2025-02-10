import EmailRepository from './EmailRepository';
import RetryRepository from './RetryRepository';
import { SendEmailDTO } from "./dto/SendEmailDTO";
import sendMailgunEmail from "./emailProviders/sendMailgunEmail";
import sendSendgridEmail from "./emailProviders/sendSendgridEmail";

export class EmailService {
    private emailRepository: EmailRepository;
    private retryRepository: RetryRepository;

    constructor(emailRepository: EmailRepository, retryRepository: RetryRepository) {
        this.emailRepository = emailRepository;
        this.retryRepository = retryRepository;
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
                    emailSent = true;
                } catch (error) {
                    console.error('SendGrid failed to send the email');
                }
            }
            if (!emailSent) {
                console.log('Saving for retry');
                try {
                    await this.retryRepository.createRetry(senderEmail, sendEmailDTO.to, sendEmailDTO.subject, sendEmailDTO.body);
                    console.log('Retry saved successfully');
                } catch (error) {
                    console.error('Failed to save retry:', error);
                }
                throw new Error('Failed to send email via both Mailgun and SendGrid');
            }

        } catch (error) {
            throw error;
        }
    }

    public async retryUnsentEmails(): Promise<void> {
        const unsentEmails = await this.retryRepository.getUnsentEmails();
        for (const unsentEmail of unsentEmails) {
            try {
                const sendEmailDTO = new SendEmailDTO(unsentEmail.to, unsentEmail.subject, unsentEmail.body);
                await this.sendEmail(sendEmailDTO, unsentEmail.from);
                await this.retryRepository.markAsSent(unsentEmail.id);
            } catch (error) {
                console.error(`Failed to send email to ${unsentEmail.to}`);
            }
        }
    }
}

export default new EmailService(new EmailRepository(), new RetryRepository());