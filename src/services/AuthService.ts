import { AuthManager } from "../config/auht0config";
import { AxiosResponse } from "axios";
import { CreateUserDTO } from "../dto/user/CreateUserDTO";
import UserRepository from "../repositories/UserRepository";

export class AuthService {
    private authManager: AuthManager;
    private userRepository: UserRepository;

    constructor(authManager: AuthManager, userRepository: UserRepository) {
        this.authManager = authManager;
        this.userRepository = userRepository;
    }

    public async login(email: string, password: string): Promise<AxiosResponse | undefined> {
        console.log('AuthService.login');
        return this.authManager.login(email, password);
    }

    public async register(email: string, password: string): Promise<AxiosResponse | undefined> {
        console.log('AuthService.register');
        const response = await this.authManager.register(email, password);
        if (response && response.data) {
            await this.userRepository.create(new CreateUserDTO(email));
        }
        return response;
    }
}

export default new AuthService(new AuthManager(), new UserRepository());