import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';

dotenv.config();

const authVariables = {
  authDomain: process.env.AUTH0_DOMAIN as string,
  authClientId: process.env.AUTH0_CLIENT_ID as string,
  authClientSecret: process.env.AUTH0_CLIENT_SECRET as string,
  authApiAudience: process.env.AUTH0_API_AUDIENCE as string,
  authIssuer: process.env.AUTH0_ISSUER as string,
};

class AuthManager {
  private async getAuth0Token(): Promise<string | undefined> {
    try {
      const response: AxiosResponse<{ access_token: string }> = await axios.post(
        `https://${authVariables.authDomain}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: authVariables.authClientId,
          client_secret: authVariables.authClientSecret,
          audience: `https://${authVariables.authDomain}/api/v2/`,
          scope: 'read:users update:users create:users'
        }
      );
      return response.data.access_token;
    } catch (error: any) {
      console.error(
        'Error al obtener el token:',
        error.response ? error.response.data : error.message
      );
    }
  }

  public async login(email: string, password: string): Promise<AxiosResponse | undefined> {
      console.log('AuthConfig.login');
    const accessToken = await this.getAuth0Token();
    if (!accessToken) {
         console.log('Error al obtener el token');
      throw new Error('Failed to obtain access token');
    }
    console.log('Access token:', accessToken);
    const response: AxiosResponse = await axios.post(
      `https://${authVariables.authDomain}/oauth/token`,
      {
        grant_type: 'password',
        username: email,
        password,
        client_id: authVariables.authClientId,
        client_secret: authVariables.authClientSecret,
        connection: 'Username-Password-Authentication',
        audience: authVariables.authApiAudience,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Response:', response);
    return response;
  }

  public async register(email: string, password: string): Promise<AxiosResponse | undefined> {
    const accessToken = await this.getAuth0Token();
    if (!accessToken) {
      throw new Error('Failed to obtain access token');
    }
    const response: AxiosResponse = await axios.post(
      `https://${authVariables.authDomain}/api/v2/users`,
      {
        email,
        password,
        connection: 'Username-Password-Authentication',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  }
}

export { AuthManager, authVariables };