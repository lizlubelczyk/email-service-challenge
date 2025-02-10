export class RetryDTO {
    public fromEmail: string;
    public toEmail: string;
    public subject: string;
    public body: string;

    constructor(fromEmail: string, toEmail: string, subject: string, body: string) {
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.subject = subject;
        this.body = body;
    }
}