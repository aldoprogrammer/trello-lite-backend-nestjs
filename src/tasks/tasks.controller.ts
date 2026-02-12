import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskStatus } from './task.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('projects/:projectId/tasks')
  async findAll(
    @Req() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const tasks = await this.tasksService.findAllForProject(
      req.user.userId,
      projectId,
    );
    return {
      success: true,
      message: tasks.length ? 'Tasks fetched' : 'No tasks found',
      data: tasks,
    };
  }

  @Post('projects/:projectId/tasks')
  create(
    @Req() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService
      .create(req.user.userId, projectId, dto)
      .then((data) => ({ success: true, message: 'Task created', data }));
  }

  @Get('projects/:projectId/tasks/:id')
  async findOne(
    @Req() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.tasksService.findOneForProject(
      req.user.userId,
      projectId,
      id,
    );
    return { success: true, message: 'Task detail', data };
  }

  @Put('projects/:projectId/tasks/:id')
  async update(
    @Req() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    const data = await this.tasksService.update(
      req.user.userId,
      projectId,
      id,
      dto,
    );
    return { success: true, message: 'Task updated', data };
  }

  @Delete('projects/:projectId/tasks/:id')
  async remove(
    @Req() req: any,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.tasksService.remove(req.user.userId, projectId, id);
    return { success: true, message: 'Task deleted', data: null };
  }

  @Get('statuses')
  statuses() {
    const data = this.tasksService.statuses();
    return { success: true, message: 'Task statuses', data };
  }
}
