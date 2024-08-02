import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';

@Controller('thread')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) { }

  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  create(@Request() req, @Body() createThreadDto: CreateThreadDto) {
    const userId = req.user.id
    return this.threadService.create(createThreadDto, userId);
  }

  @Get()
  findAll() {
    return this.threadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.threadService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  update(@Request() req, @Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    const userId = req.user.id
    return this.threadService.update(+id, updateThreadDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadService.remove(+id);
  }
}
