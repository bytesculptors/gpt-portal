import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DataSource } from 'typeorm';
import OpenAI from 'openai'
import 'dotenv/config';

// dotenv.config()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

@Injectable()
export class MessageService {
  constructor(
    private connection: DataSource,
    // private messageGateway: MessageGateway,
    // private server: Server
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
    // const membersId = thread.members.map((member) => member.id)
    if (thread.creator.id !== sender.id) {
      throw new UnauthorizedException('You cannot send message to this thread')
    }
    // const receiver = await this.connection.getRepository('User').findOneBy({ id: receiverId })
    // if (!receiver) {
    //   throw new NotFoundException('This receiver does not exist!!')
    // }
    // if (thread.creator.id !== receiverId && !membersId.includes(receiverId)) {
    //   throw new UnauthorizedException(`The user with id ${receiverId} has not been added to this thread!`)
    // }
    const message = this.connection.getRepository('Message').create({
      content: content['content'],
      thread: thread,
      sender: sender
    })
    await this.connection.getRepository('Message').save(message)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ "role": "user", "content": content['content'] }],
      // stream: true
    })
    const replyData = response.choices[0].message
    const reply = this.connection.getRepository('Message').create({
      content: replyData.content,
      thread: thread,
      sender: null,
      replyTo: message
    })
    await this.connection.getRepository('Message').save(reply)
    return { response: replyData.content }
  }
  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  async findAll() {
    // return `This action returns all message`;
    const messages = await this.connection.getRepository('Message').find({
      relations: ['replyTo']
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
