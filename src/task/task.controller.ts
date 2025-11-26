import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/task')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({
    summary: 'Get Daily Tasks',
    description:
      'Retrieve tasks created today in paginated format \n  Default `count` is 10 tasks per `page`.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved daily tasks.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        count: { type: 'number' },
        page: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing authentication token.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiBearerAuth()
  @Get('daily')
  getDailyTasks(@Req() req) {
    const userId = req.user.id;
    return this.taskService.getDailyTasks(userId);
  }

  @ApiOperation({
    summary: 'Create Task',
    description: 'Create a new task with the provided details.',
  })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        pointValue: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({
    summary: 'Get All Tasks',
    description: 'Retrieve all tasks in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all tasks.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        count: { type: 'number' },
        page: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing authentication token.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @ApiOperation({
    summary: 'Get Task by ID',
    description: 'Retrieve a specific task by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the task.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        pointValue: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing authentication token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update Task',
    description: 'Update the details of an existing task by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        pointValue: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing authentication token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @ApiOperation({
    summary: 'Delete Task',
    description: 'Delete a specific task by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task successfully deleted.',
    schema: {
      type: 'object',
      properties: { id: { type: 'string' } },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing authentication token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  @ApiOperation({
    summary: 'Complete Task',
    description: 'Mark a specific task as completed by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Task successfully marked as completed.',
  })
  @ApiBearerAuth()
  @Post(':id/complete')
  completeTask(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.taskService.completeTask(id, userId);
  }
}
