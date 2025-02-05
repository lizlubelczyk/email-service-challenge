import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthManager } from "../config/auht0config";
import { RegisterDTO } from '../dto/auth/RegisterDTO';
import {LoginDto} from "../dto/auth/LoginDTO";
import UserRepository from "../repositories/UserRepository";

class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error('Missing required fields');
            }
            const loginDto = new LoginDto(email, password);
            const response = await this.authService.login(loginDto.email, loginDto.password);
            if (response) {
                res.status(response.status).send(response.data);
            } else {
                res.status(500).send('Login failed');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Login failed');
        }
    }

    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error('Missing required fields');
            }
            const registerDto = new RegisterDTO(email, password);
            const response = await this.authService.register(registerDto.email, registerDto.password);
            if (response) {
                res.status(response.status).send(response.data);
            } else {
                res.status(500).send('Registration failed');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Registration failed');
        }
    }
}

export default new AuthController(new AuthService(new AuthManager(), new UserRepository()));