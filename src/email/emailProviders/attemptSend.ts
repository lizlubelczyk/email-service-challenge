import {SendEmailDTO} from "../dto/SendEmailDTO";
import RetryRepository from "../RetryRepository";
import sendMailgunEmail from "./sendMailgunEmail";
import sendSendgridEmail from "./sendSendgridEmail";

export async function attemptToSendEmail(sendEmailDTO: SendEmailDTO, senderEmail: string, retryRepository: RetryRepository): Promise<void> {
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
            await retryRepository.createRetry(senderEmail, sendEmailDTO.to, sendEmailDTO.subject, sendEmailDTO.body);
            console.log('Retry saved successfully');
        } catch (error) {
            console.error('Failed to save retry:', error);
        }
        throw new Error('Failed to send email via both Mailgun and SendGrid');
    }
}