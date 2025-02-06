import sgMail from '@sendgrid/mail';
import {SendEmailDTO} from "../dto/email/SendEmailDTO";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

async function sendSendgridEmail(sendEmailDTO: SendEmailDTO, replyTo: string): Promise<void> {
    const from = `${process.env.SENDGRID_VERIFIED_SENDER as string}`;
    try {
        const msg = {
            to: sendEmailDTO.to,
            from: from,
            subject: sendEmailDTO.subject,
            text: sendEmailDTO.body,
            replyTo: replyTo,
        };

        await sgMail.send(msg);
        console.log('Email sent successfully via Sendgrid');
    } catch (error) {
        console.error('Error sending email via Sendgrid:', error);
        throw error;
    }
}

export default sendSendgridEmail;