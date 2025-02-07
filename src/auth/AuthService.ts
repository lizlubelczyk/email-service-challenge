import { AuthManager } from "./auht0config";
import { AxiosResponse } from "axios";
import { CreateUserDTO } from "./dto/CreateUserDTO";
import UserRepository from "./UserRepository";

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

    public async isAdmin(email: string): Promise<boolean> {
        console.log('AuthService.isAdmin');
        return this.userRepository.isAdmin(email);
    }
}

export default new AuthService(new AuthManager(), new UserRepository());