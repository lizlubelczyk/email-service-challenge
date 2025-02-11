import EmailRepository from './EmailRepository';
import RetryRepository from './RetryRepository';
import { SendEmailDTO } from "./dto/SendEmailDTO";
import sendMailgunEmail from "./emailProviders/sendMailgunEmail";
import sendSendgridEmail from "./emailProviders/sendSendgridEmail";
import {attemptToSendEmail} from "./emailProviders/attemptSend";

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
            await attemptToSendEmail(sendEmailDTO, senderEmail, this.retryRepository);
            await this.emailRepository.createEmail(senderEmail);
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