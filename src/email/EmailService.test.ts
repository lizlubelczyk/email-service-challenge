import {EmailService} from "./EmailService";
import EmailRepository from "./EmailRepository";
import {SendEmailDTO} from "./dto/SendEmailDTO";
import sendMailgunEmail from "./emailProviders/sendMailgunEmail";
import sendSendgridEmail from "./emailProviders/sendSendgridEmail";
import RetryRepository from "./RetryRepository";


jest.mock('./emailProviders/sendMailgunEmail');
jest.mock('./emailProviders/sendSendgridEmail');
jest.mock('./EmailRepository');
jest.mock('./RetryRepository');

describe('EmailService - Failover Test', () => {
    let emailService: EmailService;
    let emailRepository: jest.Mocked<EmailRepository>;
    let retryRepository: jest.Mocked<RetryRepository>;

    beforeEach(() => {
        emailRepository = new EmailRepository() as jest.Mocked<EmailRepository>;
        retryRepository = new RetryRepository() as jest.Mocked<RetryRepository>;
        emailService = new EmailService(emailRepository, retryRepository);
        jest.clearAllMocks()
    });

    it('should failover to SendGrid when Mailgun fails', async () => {
        const sendEmailDTO: SendEmailDTO = {
            to: 'recipient@example.com',
            subject: 'Test Email',
            body: 'This is a test email'
        };
        const senderEmail = 'sender@example.com';

        emailRepository.getEmailCountForUserToday.mockResolvedValue(10);
        emailRepository.createEmail.mockResolvedValue({
            id: "1",
            senderEmail: 'sender@example.com',
            createdAt: new Date(),
        });

        (sendMailgunEmail as jest.Mock).mockRejectedValue(new Error('Mailgun failed'));

        (sendSendgridEmail as jest.Mock).mockResolvedValue(undefined);

        await emailService.sendEmail(sendEmailDTO, senderEmail);

        expect(sendMailgunEmail).toHaveBeenCalledWith(sendEmailDTO, senderEmail);
        expect(sendSendgridEmail).toHaveBeenCalledWith(sendEmailDTO, senderEmail);
    });

    it('should throw an error if both Mailgun and SendGrid fail', async () => {
        const sendEmailDTO: SendEmailDTO = {
            to: 'recipient@example.com',
            subject: 'Test Email',
            body: 'This is a test email'
        };
        const senderEmail = 'sender@example.com';

        emailRepository.getEmailCountForUserToday.mockResolvedValue(10);
        emailRepository.createEmail.mockResolvedValue({
            id: "1",
            senderEmail: 'sender@example.com',
            createdAt: new Date(),
        });

        (sendMailgunEmail as jest.Mock).mockRejectedValue(new Error('Mailgun failed'));

        (sendSendgridEmail as jest.Mock).mockRejectedValue(new Error('SendGrid failed'));

        await expect(emailService.sendEmail(sendEmailDTO, senderEmail))
            .rejects.toThrow('Failed to send email via both Mailgun and SendGrid');

        expect(sendMailgunEmail).toHaveBeenCalledWith(sendEmailDTO, senderEmail);
        expect(sendSendgridEmail).toHaveBeenCalledWith(sendEmailDTO, senderEmail);
    });

    it('should not send email if getEmailCountForUserToday returns 1000', async () => {
        const sendEmailDTO: SendEmailDTO = {
            to: 'recipient@example.com',
            subject: 'Test Email',
            body: 'This is a test email'
        };
        const senderEmail = 'sender@example.com';

        emailRepository.getEmailCountForUserToday.mockResolvedValue(1000);

        await expect(emailService.sendEmail(sendEmailDTO, senderEmail))
            .rejects.toThrow('You have reached the maximum email limit for today');

        expect(emailRepository.getEmailCountForUserToday).toHaveBeenCalledWith(senderEmail);
        expect(sendMailgunEmail).not.toHaveBeenCalled();
        expect(sendSendgridEmail).not.toHaveBeenCalled();
    });

    it('should save unsent email as a retry', async () => {
        const sendEmailDTO: SendEmailDTO = {
            to: 'recipient@example.com',
            subject: 'Test Email',
            body: 'This is a test email'
        };
        const senderEmail = 'sender@example.com';

        emailRepository.getEmailCountForUserToday.mockResolvedValue(10);
        emailRepository.createEmail.mockResolvedValue({
            id: "1",
            senderEmail: 'sender@example.com',
            createdAt: new Date(),
        });

        (sendMailgunEmail as jest.Mock).mockRejectedValue(new Error('Mailgun failed'));
        (sendSendgridEmail as jest.Mock).mockRejectedValue(new Error('SendGrid failed'));

        await expect(emailService.sendEmail(sendEmailDTO, senderEmail))
            .rejects.toThrow('Failed to send email via both Mailgun and SendGrid');

        expect(retryRepository.createRetry).toHaveBeenCalledWith(
            "sender@example.com",
            "recipient@example.com",
            "Test Email",
            "This is a test email",
        );
    });
});
