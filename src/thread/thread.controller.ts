import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Req } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) { }

  // User: create thread
  @Post('')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  create(@Request() req, @Body() createThreadDto: CreateThreadDto) {
    const userId = req.user.id
    return this.threadService.create(createThreadDto, userId);
  }

  // User: update their own thread
  @Patch(':threadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  update(@Request() req, @Param('threadId') threadId: string, @Body() updateThreadDto: UpdateThreadDto) {
    const userId = req.user.id
    return this.threadService.update(userId, +threadId, updateThreadDto);
  }

  // User: delete their own thread
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Delete(':threadId')
  remove(@Request() req, @Param('threadId') threadId: string) {
    const userId = req.user.id
    return this.threadService.remove(userId, +threadId);
  }

  // User: find all messages in a thread that you created
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Get(':threadId/messages')
  findAll(@Request() req, @Param('threadId') threadId: number, @Query('page') page: number) {
    const userId = req.user.id
    return this.threadService.findAll(userId, threadId, page);
  }

  // Admin: List all threads of all users or a specific user
  @Get('')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  find(@Query('username') username: string | null) {
    return this.threadService.find(username);
  }

  // Admin: Search by thread id
  @Get(':threadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async search(@Param('threadId') threadId: number) {
    return this.threadService.search(threadId)
  }

}
