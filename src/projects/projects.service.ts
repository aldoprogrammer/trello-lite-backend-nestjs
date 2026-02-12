import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
  ) {}

  async findAllForUser(userId: number) {
    return this.projectsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['tasks'],
    });
  }

  async findOneForUser(userId: number, id: number) {
    const project = await this.projectsRepo.findOne({
      where: { id, userId },
      relations: ['tasks'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(userId: number, dto: CreateProjectDto) {
    const project = this.projectsRepo.create({ ...dto, userId });
    return this.projectsRepo.save(project);
  }

  async update(userId: number, id: number, dto: UpdateProjectDto) {
    const project = await this.findOneForUser(userId, id);
    Object.assign(project, dto);
    return this.projectsRepo.save(project);
  }

  async remove(userId: number, id: number) {
    const project = await this.findOneForUser(userId, id);
    await this.projectsRepo.remove(project);
    return { success: true };
  }
}
