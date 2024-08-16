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
  @Post('create')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  create(@Request() req, @Body() createThreadDto: CreateThreadDto) {
    const userId = req.user.id
    return this.threadService.create(createThreadDto, userId);
  }

  // // User: find their own threads
  // @Get('user/threads')
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(Role.USER)
  // findOwnThread(@Request() req) {
  //   const userId = req.user.id
  //   return this.threadService.findOwnThread(userId)
  // }

  // User: update their own thread
  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  update(@Request() req, @Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    const userId = req.user.id
    return this.threadService.update(userId, +id, updateThreadDto);
  }

  // // User: add context to their own thread
  // @Post('addContext/:threadId')
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(Role.USER)
  // addContext(@Request() req, @Body() context: string, @Param('threadId') threadId: number) {
  //   const userId = req.user.id
  //   return this.threadService.addContext(context['context'], threadId, userId)
  // }

  // User: delete their own thread
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id
    return this.threadService.remove(userId, +id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Get(':threadId/messages')
  findAll(@Request() req, @Param('threadId') threadId: number) {
    const userId = req.user.id
    return this.threadService.findAll(userId, threadId);
  }

  // Admin: List all threads of all users or a specific user
  @Get('')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  find(@Query('username') username: string | null) {
    return this.threadService.find(username);
  }

  // Admin: Search by thread id
  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async search(id: number) {
    return this.threadService.search(id)
  }

}
