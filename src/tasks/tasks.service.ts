import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from '../projects/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
  ) {}

  private async ensureProjectAccess(userId: number, projectId: number) {
    const project = await this.projectsRepo.findOne({
      where: { id: projectId, userId },
    });
    if (!project) throw new ForbiddenException('Project not found');
    return project;
  }

  async findAllForProject(userId: number, projectId: number) {
    await this.ensureProjectAccess(userId, projectId);
    return this.tasksRepo.find({
      where: { projectId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForProject(userId: number, projectId: number, id: number) {
    await this.ensureProjectAccess(userId, projectId);
    const task = await this.tasksRepo.findOne({
      where: { id, projectId, userId },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  create(userId: number, projectId: number, dto: CreateTaskDto) {
    return this.ensureProjectAccess(userId, projectId).then(() => {
      const task = this.tasksRepo.create({
        ...dto,
        projectId,
        userId,
        status: dto.status ?? TaskStatus.PENDING,
      });
      return this.tasksRepo.save(task);
    });
  }

  async update(
    userId: number,
    projectId: number,
    id: number,
    dto: UpdateTaskDto,
  ) {
    await this.ensureProjectAccess(userId, projectId);
    const task = await this.findOneForProject(userId, projectId, id);
    Object.assign(task, dto);
    return this.tasksRepo.save(task);
  }

  async remove(userId: number, projectId: number, id: number) {
    await this.ensureProjectAccess(userId, projectId);
    const task = await this.findOneForProject(userId, projectId, id);
    await this.tasksRepo.remove(task);
    return { success: true };
  }

  statuses() {
    return Object.values(TaskStatus).map((value) => ({
      value,
      label: value.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    }));
  }
}
