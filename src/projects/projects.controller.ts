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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const projects = await this.projectsService.findAllForUser(req.user.userId);
    return {
      success: true,
      message: projects.length ? 'Projects fetched' : 'No projects found',
      data: projects,
    };
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateProjectDto) {
    const data = await this.projectsService.create(req.user.userId, dto);
    return { success: true, message: 'Project created', data };
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const data = await this.projectsService.findOneForUser(
      req.user.userId,
      id,
    );
    return { success: true, message: 'Project detail', data };
  }

  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    const data = await this.projectsService.update(req.user.userId, id, dto);
    return { success: true, message: 'Project updated', data };
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(req.user.userId, id);
    return { success: true, message: 'Project deleted', data: null };
  }
}
