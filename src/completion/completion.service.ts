import { Injectable } from '@nestjs/common';
import { CreateCompletionDto } from './dto/create-completion.dto';
import { UpdateCompletionDto } from './dto/update-completion.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CompletionService {
  constructor(private prismaService: PrismaService) {}

  create(taskId: string, userId: string) {
    return this.prismaService.task.update({
      where: { id: taskId },
      data: { completions: { create: { userId } } },
    });
  }

  // findAll() {
  //   return `This action returns all completion`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} completion`;
  // }

  // update(id: number, updateCompletionDto: UpdateCompletionDto) {
  //   return `This action updates a #${id} completion`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} completion`;
  // }
}
