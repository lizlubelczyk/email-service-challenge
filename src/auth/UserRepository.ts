import {CreateUserDTO} from "./dto/CreateUserDTO";
import {PrismaClient, user } from "@prisma/client";

class UserRepository {
  private prisma: PrismaClient;

  constructor() {
      this.prisma = new PrismaClient();
  }

  public async create(data: CreateUserDTO): Promise<user> {
        console.log('UserRepository.create');
        return this.prisma.user.create({
            data: {
                email: data.email,
            },
        });
  }

  public async findByEmail(email: string): Promise<user | null> {
    console.log('UserRepository.findByEmail');
    return this.prisma.user.findUnique({
        where: {
            email,
        },
    });
  }

    public async isAdmin(email: string): Promise<boolean> {
        console.log('UserRepository.isAdmin');
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                role: true,
            },
        });
        console.log('UserRepository.isAdmin: user', user);
        return user?.role === 'ADMIN';
    }
}

export default UserRepository;