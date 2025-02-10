import UserRepository from "../auth/UserRepository";
import EmailRepository from "../email/EmailRepository";
import emailRepository from "../email/EmailRepository";

class StatsService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public async getStats(): Promise<{ email: string, emailCount: number }[]> {
        const stats = await this.emailRepository.getUserEmailStatsForToday();
        return stats;
    }
}

export default StatsService;