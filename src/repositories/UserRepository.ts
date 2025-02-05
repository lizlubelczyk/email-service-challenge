import {CreateUserDTO} from "../dto/user/CreateUserDTO";
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

}

export default UserRepository;