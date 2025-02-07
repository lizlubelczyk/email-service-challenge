import UserRepository from "../auth/UserRepository";
import EmailRepository from "../email/EmailRepository";
import emailRepository from "../email/EmailRepository";

class StatsService {
    private emailRepository: EmailRepository;

    constructor(emailRepository: EmailRepository) {
        this.emailRepository = emailRepository;
    }

    public async getStats() {
        console.log('StatsService.getStats')
        const stats = await this.emailRepository.getUserEmailStatsForToday();
        console.log('StatsService.getStats: stats', stats);
        return stats;
    }
}

export default StatsService;