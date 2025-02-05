import {AuthManager} from "../config/auht0config";
import {AxiosResponse} from "axios";

export class AuthService{
    private authManager: AuthManager;

    constructor(authManager: AuthManager){
        this.authManager = authManager;
    }

    public async login(email: string, password: string): Promise<AxiosResponse | undefined> {
        console.log('AuthService.login');
        return this.authManager.login(email, password);
    }

    public async register(email: string, password: string): Promise<AxiosResponse | undefined> {
        console.log('AuthService.register');
        return this.authManager.register(email, password);
    }
}

export default new AuthService(new AuthManager());