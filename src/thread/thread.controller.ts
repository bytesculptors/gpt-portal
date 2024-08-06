import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';
import { AddMemberDto } from './dto/add-member.dto';

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

  @Get('findOwnThreads')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  findOwnThread(@Request() req) {
    const userId = req.user.id
    return this.threadService.findOwnThread(userId)
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  update(@Request() req, @Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    const userId = req.user.id
    return this.threadService.update(userId, +id, updateThreadDto);
  }

  @Post('addContext/:threadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  addContext(@Request() req, @Body() context: string, @Param('threadId') threadId: number) {
    const userId = req.user.id
    return this.threadService.addContext(context['context'], threadId, userId)
  }

  // @Patch('addMember/:id')
  // @UseGuards(AuthGuard, RoleGuard)
  // @Roles(Role.USER)
  // addMember(@Request() req, @Param('id') id: string, @Body() addMemberDto: AddMemberDto) {
  //   const userId = req.user.id
  //   return this.threadService.addMember(+id, addMemberDto, userId);
  // }

  @Get('find')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.threadService.findAll();
  }

  @Get('findOne')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async search(@Query('name') threadName: string) {
    return this.threadService.search(threadName)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.threadService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadService.remove(+id);
  }
}
