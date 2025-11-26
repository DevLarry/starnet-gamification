import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prismaService.task.create({
      data: {
        ...createTaskDto,
      },
    });
  }

  async findAll(count: number = 10, page: number = 1) {
    const tasks = await this.prismaService.task.findMany({
      take: count,
      skip: page ? (page - 1) * count : 0,
    });
    return { data: tasks, count, page };
  }

  findOne(id: string) {
    return this.prismaService.task.findUnique({
      where: { id },
    });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prismaService.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
      },
    });
  }

  remove(id: string) {
    return this.prismaService.task.delete({
      where: { id },
    });
  }

  async getDailyTasks(count: number = 10, page: number = 1) {
    const tasks = await this.prismaService.task.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
    return { data: tasks, count, page};
  }

  async completeTask(taskId: string, userId: string) {

     const completion = await this.prismaService.task.update({
      where: { id: taskId },
      data: { completions: { create: { userId } } },
    });

    if (!completion) 
      throw new InternalServerErrorException('Could not complete task');

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { point: { increment: completion.pointValue } },
    });

    if (!user)
      throw new InternalServerErrorException('Could not update user points');
    return completion;
  }
}
