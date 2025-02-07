import UserRepository from "../repositories/UserRepository";
import EmailRepository from "../repositories/EmailRepository";
import emailRepository from "../repositories/EmailRepository";

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