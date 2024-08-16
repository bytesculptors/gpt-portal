import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ValidationPipe, Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';
import { Response } from 'express';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('threads/:threadId/messages')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  send(
    @Request() req,
    @Body(new ValidationPipe()) content: string,
    @Param('threadId') threadId: number,
    @Res() res: Response
  ) {
    const senderId = req.user.id
    return this.messageService.send(res, content, threadId, senderId)
  }
}
