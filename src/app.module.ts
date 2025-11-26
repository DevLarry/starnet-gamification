import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma.service';
import { MailerService } from './email/email.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './auth/hash.service';
import { TaskModule } from './task/task.module';
import { CompletionModule } from './completion/completion.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [AuthModule, TaskModule, CompletionModule, WalletModule],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    MailerService,
    JwtService,
    HashService,
  ],
})
export class AppModule {}
