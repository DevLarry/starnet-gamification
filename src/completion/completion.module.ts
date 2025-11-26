import { Module } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CompletionController } from './completion.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CompletionController],
  providers: [CompletionService, PrismaService],
})
export class CompletionModule {}
