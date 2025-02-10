import StatsService from './StatsService';
import EmailRepository from '../email/EmailRepository';

// Mock the EmailRepository
jest.mock('../email/EmailRepository');

describe('StatsService', () => {
    let statsService: StatsService;
    let emailRepository: jest.Mocked<EmailRepository>;

    beforeEach(() => {
        emailRepository = new EmailRepository() as jest.Mocked<EmailRepository>;
        statsService = new StatsService(emailRepository);

        jest.clearAllMocks();
    });

    it('should return stats from EmailRepository as a list of objects with email and emailCount properties', async () => {
        const mockStats = [
            { email: 'user1@example.com', emailCount: 5 },
            { email: 'user2@example.com', emailCount: 3 }
        ];

        emailRepository.getUserEmailStatsForToday.mockResolvedValue(mockStats);

        const stats = await statsService.getStats();

        expect(stats).toEqual(mockStats);
        expect(emailRepository.getUserEmailStatsForToday).toHaveBeenCalled();
    });

    it('should handle errors from EmailRepository', async () => {
        emailRepository.getUserEmailStatsForToday.mockRejectedValue(new Error('Failed to fetch stats'));

        await expect(statsService.getStats()).rejects.toThrow('Failed to fetch stats');
        expect(emailRepository.getUserEmailStatsForToday).toHaveBeenCalled();
    });


});