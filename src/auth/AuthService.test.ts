import { AuthService } from './AuthService';
import { AuthManager } from './auht0config';
import UserRepository from './UserRepository';
import axios, { AxiosResponse, AxiosHeaders } from 'axios';
import { CreateUserDTO } from './dto/CreateUserDTO';

// Mock dependencies
jest.mock('./auht0config');
jest.mock('./UserRepository');

describe('AuthService', () => {
    let authService: AuthService;
    let authManager: jest.Mocked<AuthManager>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        authManager = new AuthManager() as jest.Mocked<AuthManager>;
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        authService = new AuthService(authManager, userRepository);
    });

    it('should login successfully', async () => {
        const email = 'test@example.com';
        const password = 'password';

        const response: AxiosResponse = {
            data: { token: 'fake-jwt-token' },
            status: 200,
            statusText: 'OK',
            headers: new AxiosHeaders(),
            config: { headers: new AxiosHeaders() }
        };

        authManager.login.mockResolvedValue(response);

        const result = await authService.login(email, password);

        expect(authManager.login).toHaveBeenCalledWith(email, password);
        expect(result).toBe(response);
    });

    it('should register successfully and create a user', async () => {
        const email = 'test@example.com';
        const password = 'password';

        const response: AxiosResponse = {
            data: { userId: '12345' },
            status: 201,
            statusText: 'Created',
            headers: new AxiosHeaders(),
            config: { headers: new AxiosHeaders() }
        };

        authManager.register.mockResolvedValue(response);

        const result = await authService.register(email, password);

        expect(authManager.register).toHaveBeenCalledWith(email, password);
        expect(userRepository.create).toHaveBeenCalledWith(new CreateUserDTO(email));
        expect(result).toBe(response);
    });

    it('should check if user is admin', async () => {
        const email = 'admin@example.com';
        userRepository.isAdmin.mockResolvedValue(true);

        const result = await authService.isAdmin(email);

        expect(userRepository.isAdmin).toHaveBeenCalledWith(email);
        expect(result).toBe(true);
    });
});
