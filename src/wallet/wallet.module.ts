import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { HashService } from '../auth/hash.service';
import { MailerService } from '../email/email.service';

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    AuthService,
    PrismaService,
    MailerService,
    HashService,
    JwtService,
  ],
})
export class WalletModule {}
