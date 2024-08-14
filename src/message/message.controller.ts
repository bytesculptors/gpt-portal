import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('send/:threadId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  send(
    @Request() req,
    @Body(new ValidationPipe()) content: string,
    @Param('threadId') threadId: number
  ) {
    const senderId = req.user.id
    return this.messageService.send(content, threadId, senderId)
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  @Get('getMessages/:threadId')
  findAll(@Request() req, @Param('threadId') threadId: number) {
    const userId = req.user.id
    return this.messageService.findAll(userId, threadId);
  }

}
