import EmailRepository from '../repositories/EmailRepository';

export class EmailService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public async sendEmail(to: string, subject: string, body: string): Promise<void> {
        console.log(`Sending email to ${to}`);
        try {
            await this.emailRepository.createEmail(to);
            console.log(`Email saved to database for ${to}`);
        } catch (error) {
            console.log('Failed to save email to database', error);
            console.error('Failed to save email to database', error);
            throw error;
        }
    }
}

export default new EmailService(new EmailRepository());