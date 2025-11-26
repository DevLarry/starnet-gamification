import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from '../email/email.service';
import { HashService } from './hash.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    MailerService,
    HashService
  ],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
})
export class AuthModule {}
