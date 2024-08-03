import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    private connection: DataSource
  ) { }
  async send(content: string, threadId: number, sender: User, receiverId: number) {
    const thread = await this.connection.getRepository('Thread').findOne({
      where: { id: threadId },
      relations: ['creator', 'members']
    })

    if (!thread) {
      throw new NotFoundException('This thread does not exist!!')
    }
    const membersId = thread.members.map((member) => member.id)
    if (thread.creator.id !== sender.id && !membersId.includes(sender.id)) {
      throw new UnauthorizedException('You cannot send message to this thread')
    }
    const receiver = await this.connection.getRepository('User').findOneBy({ id: receiverId })
    if (!receiver) {
      throw new NotFoundException('This receiver does not exist!!')
    }
    const message = this.connection.getRepository('Message').create({
      content: content,
      thread: thread,
      sender: sender,
      receiver: receiver
    })
    await this.connection.getRepository('Message').save(message)
    return message
  }
  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
