import {EmailService} from './email/EmailService';
import cron from 'node-cron';
import EmailRepository from "./email/EmailRepository";
import RetryRepository from "./email/RetryRepository";

const emailService = new EmailService(new EmailRepository(), new RetryRepository());

(async () => {
    console.log('Running retry job...');
    await emailService.retryUnsentEmails();
})();

cron.schedule('*/15 * * * *', async () => {
    console.log('Running retry job...');
    await emailService.retryUnsentEmails();
});