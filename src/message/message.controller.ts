import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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

  @Post('send/:threadId/:receiverId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  send(
    @Request() req,
    @Body() content: string,
    @Param('threadId') threadId: number,
    @Param('receiverId') receiverId: number
  ) {
    const sender = req.user
    return this.messageService.send(content, threadId, sender, receiverId)
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
