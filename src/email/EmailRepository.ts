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

    public async getUserEmailStatsForToday(): Promise<{ email: string, emailCount: number }[]> {
        console.log('EmailRepository.getUserEmailStatsForToday');
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const emailStats = await this.prisma.email.groupBy({
            by: ['senderEmail'],
            where: {
                createdAt: {
                    gte: startOfDay,
                },
            },
            _count: {
                senderEmail: true,
            },
        });
        console.log('EmailRepository.getUserEmailStatsForToday: emailStats', emailStats);

        return emailStats.map(stat => ({
            email: stat.senderEmail,
            emailCount: stat._count.senderEmail,
        })).filter(stat => stat.emailCount > 0);
    }

    public async getEmailCountForUserToday(senderEmail: string): Promise<number> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        return this.prisma.email.count({
            where: {
                senderEmail,
                createdAt: {
                    gte: startOfDay,
                },
            },
        });
    }
}

export default EmailRepository;