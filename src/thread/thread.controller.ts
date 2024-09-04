import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Req } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) { }

  // User: create thread
  @Post('')
  @ApiCreatedResponse({ description: 'Thread created!!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  create(@Request() req, @Body() createThreadDto: CreateThreadDto) {
    const userId = req.user.id
    return this.threadService.create(createThreadDto, userId);
  }

  // User: update their own thread
  @Patch(':threadId')
  @ApiOkResponse({ description: 'Thread updated successfully!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
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
  @ApiOkResponse({ description: 'Thread deleted successfully!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
  remove(@Request() req, @Param('threadId') threadId: string) {
    const userId = req.user.id
    return this.threadService.remove(userId, +threadId);
  }

  // User: find all messages in a thread that you created
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Get(':threadId/messages')
  @ApiOkResponse({ description: 'Add messages found!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
  findAll(@Request() req, @Param('threadId') threadId: number, @Query('page') page: number, @Query('limit') limit: number) {
    const userId = req.user.id
    return this.threadService.findAll(userId, threadId, page, limit);
  }

  // Admin: List all threads of all users or a specific user
  @Get('')
  @ApiOkResponse({ description: 'All threads found!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  find(@Query('username') username: string | null) {
    return this.threadService.find(username);
  }

  // Admin: Search by thread id
  @Get(':threadId')
  @ApiOkResponse({ description: 'Thread found!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async search(@Param('threadId') threadId: number) {
    return this.threadService.search(threadId)
  }

}
