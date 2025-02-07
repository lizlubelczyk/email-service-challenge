export class SendEmailDTO {
  to: string;
  subject: string;
  body: string;

  constructor(to: string, subject: string, body: string) {
    this.to = to;
    this.subject = subject;
    this.body = body;
  }
}