import EmailRepository from '../repositories/EmailRepository';
import {SendEmailDTO} from "../dto/email/SendEmailDTO";

export class EmailService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public async sendEmail(sendEmailDTO: SendEmailDTO, senderEmail:string): Promise<void> {
        console.log(`Sending email to ${sendEmailDTO.to}`);
        try {
            await this.emailRepository.createEmail(senderEmail);
            console.log(`Email saved to database for ${sendEmailDTO.to}`);
        } catch (error) {
            console.log('Failed to save email to database', error);
            console.error('Failed to save email to database', error);
            throw error;
        }
    }
}

export default new EmailService(new EmailRepository());