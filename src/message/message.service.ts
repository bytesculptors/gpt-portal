import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DataSource } from 'typeorm';
import OpenAI from 'openai'
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

@Injectable()
export class MessageService {
  constructor(
    private connection: DataSource
  ) { }
  async send(content: string, threadId: number, senderId: number) {
    const thread = await this.connection.getRepository('Thread').findOne({
      where: { id: threadId },
      relations: ['creator']
    })

    if (!thread) {
      throw new NotFoundException('This thread does not exist!!')
    }
    const sender = await this.connection.getRepository('User').findOneBy({ id: senderId })

    if (!sender.isVerified) {
      throw new UnauthorizedException('You must verify your email to do send messages!')
    }
    if (thread.creator.id !== sender.id) {
      throw new UnauthorizedException('You cannot send message to this thread')
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { "role": "system", "content": `${thread.context ? thread.context : ''}` },
        { "role": "user", "content": content['content'] }
      ],
      stream: true
    })
    for await (const part of response) {
      console.log(part.choices[0].delta);
    }

  }
  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  async findAll(userId: number, threadId: number) {
    // return `This action returns all message`;
    const thread = await this.connection.getRepository('Thread').findOne({
      where: { id: threadId },
      relations: ['creator']
    })
    if (!thread) {
      throw new NotFoundException('This thread does not exist!!')
    }
    if (thread.creator.id !== userId) {
      throw new UnauthorizedException('You cannot see messages in this thread!!')
    }
    const messages = await this.connection.getRepository('Message').find({
      relations: ['replyTo', 'thread'],
      where: { thread: { id: threadId } }
    })
    return messages
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
