import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { MailerService } from '../email/email.service';
import { HashService } from '../auth/hash.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    AuthService,
    PrismaService,
    MailerService,
    HashService,
    JwtService,
  ],
})
export class TaskModule {}
