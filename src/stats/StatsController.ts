import StatsService from "./StatsService";
import EmailRepository from "../email/EmailRepository";
import {AuthService} from "../auth/AuthService";
import { Request, Response } from 'express';
import {AuthManager} from "../auth/auht0config";
import UserRepository from "../auth/UserRepository";

class StatsController {
    private statsService: StatsService;
    private authService: AuthService;

    constructor(statsService: StatsService, authService: AuthService) {
        this.statsService = statsService;
        this.authService = authService;
    }

    async getStats(req: Request, res: Response) {
        try{
            const email = req.auth?.payload['https://yourdomain.com/email'] as string;
            const isAdmin = await this.authService.isAdmin(email);
            if (!isAdmin) {
                res.status(403).send('Unauthorized');
                return;
            }
            const stats = await this.statsService.getStats();
            console.log('StatsController: Sending stats', stats);
            res.status(200).json(stats);
        } catch (error) {
            console.error('StatsController: Failed to get stats', error);
            res.status(500).send('Failed to get stats');
        }
    }
}

export default new StatsController(new StatsService(new EmailRepository()), new AuthService(new AuthManager(), new UserRepository()));