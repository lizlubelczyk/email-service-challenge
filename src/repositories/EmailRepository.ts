import { PrismaClient, Email } from '@prisma/client';

class EmailRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    public async createEmail(senderEmail: string): Promise<Email> {
        return this.prisma.email.create({
            data: {
                senderEmail,
            },
        });
    }

}

export default EmailRepository;