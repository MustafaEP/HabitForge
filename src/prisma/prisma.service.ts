import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    // Uygulama trafik almaya başlanmadan bağlanmaya hazır hale getiririz.
    async onModuleInit() {
        await this.$connect();
    }

    // Bağlantıyı düzgün bir şekilde kapatırız.
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
