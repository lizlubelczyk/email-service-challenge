import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import dotenv from 'dotenv';
import {SendEmailDTO} from "../dto/SendEmailDTO";

dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: process.env.MAILGUN_SMTP_USER as string,
        pass: process.env.MAILGUN_SMTP_PASS as string,
    },
});

async function sendMailgunEmail(sendEmailDTO: SendEmailDTO, replyTo: string): Promise<SentMessageInfo> {
    const from = `${process.env.MAILGUN_SMTP_USER as string}`;
    try {
        const mailOptions = {
            from: from,
            to: sendEmailDTO.to,
            subject: sendEmailDTO.subject,
            text: sendEmailDTO.body,
            replyTo: replyTo,
        };

        const info: SentMessageInfo = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email via Mailgun:', error);
        throw error;
    }
}

export default sendMailgunEmail;
