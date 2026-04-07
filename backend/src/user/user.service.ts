import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    // Find user by email
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    // Create a new user
    async create(userCreateDto: UserCreateDto) {
        return this.prisma.user.create({
            data: userCreateDto
        });
    }
}
