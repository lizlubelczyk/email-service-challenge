import { PrismaClient, Retry } from "@prisma/client";

class RetryRepository{
    private prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    public async createRetry(from: string, to: string, subject: string, body: string): Promise<Retry> {
        console.log('Creating retry email');
        return this.prisma.retry.create({
            data: {
                from,
                to,
                subject,
                body,
            },
        });
    }

    public async getUnsentEmails(): Promise<Retry[]> {
        return this.prisma.retry.findMany({
            where: {
                sent: false,
            },
        });
    }

    public async markAsSent(id: string): Promise<void> {
        await this.prisma.retry.update({
            where: { id },
            data: { sent: true },
        });
    }
}

export default RetryRepository;