import {CreateUserDTO} from "./dto/CreateUserDTO";
import {PrismaClient, User } from "@prisma/client";

class UserRepository {
  private prisma: PrismaClient;

  constructor() {
      this.prisma = new PrismaClient();
  }

  public async create(data: CreateUserDTO): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
            },
        });
  }

    public async isAdmin(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                role: true,
            },
        });
        return user?.role === 'ADMIN';
    }
}

export default UserRepository;