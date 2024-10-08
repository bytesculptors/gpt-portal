import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ThreadService {
  constructor(
    private connection: DataSource
  ) { }
  async create(createThreadDto: CreateThreadDto, userId: number) {
    // return 'This action adds a new thread';
    const creator = await this.connection.getRepository('User').findOne({
      where: { id: userId },
      relations: ['threadsCreated']
    })
    if (!creator.isVerified) {
      throw new UnauthorizedException('You must verify your email to do this!')
    }
    if (creator.threadsCreated.length === 10) {
      throw new ForbiddenException('You have reached the limit of creating 10 threads!!')
    }
    const thread = this.connection.getRepository('Thread').create({
      title: createThreadDto.title,
      creator: creator
    })
    await this.connection.getRepository('Thread').save(thread)
    return thread
  }

  async findOwnThread(userId: number) {
    const threads = await this.connection
      .getRepository('Thread')
      .createQueryBuilder('thread')
      .leftJoinAndSelect('thread.creator', 'creator')
      .where('creator.id = :userId', { userId })
      .getMany();

    return threads
  }

  async update(userId: number, threadId: number, updateThreadDto: UpdateThreadDto) {
    const thread = await this.connection.getRepository('Thread').findOne({
      where: { id: threadId },
      relations: ['creator']
    })
    if (!thread) {
      throw new NotFoundException('This thread has not been created!!')
    }
    if (thread.creator.id !== userId) {
      throw new UnauthorizedException('You do not have permission to update this thread!!')
    }
    thread.title = updateThreadDto.title
    if (updateThreadDto.context) thread.context = updateThreadDto.context
    await this.connection.getRepository('Thread').save(thread)
    return thread
  }

  async remove(userId: number, id: number) {
    // return `This action removes a #${id} thread`;
    const thread = await this.connection.getRepository('Thread').findOne({
      where: { id: id },
      relations: ['creator']
    })
    if (!thread) {
      throw new NotFoundException('This thread has not been created!!')
    }
    if (thread.creator.id !== userId) {
      throw new UnauthorizedException('You do not have permission to delete this thread!!')
    }
    await this.connection
      .getRepository('Message')
      .createQueryBuilder()
      .delete()
      .from('Message')
      .where("threadId = :id", { id: id })
      .execute()

    await this.connection.getRepository('Thread').delete({ id: id })
    return { message: `Thread #${id} deleted successfully!!` }
  }

  async find(username: string) {
    // return `This action returns all thread`;
    let threads
    if (!username) {
      threads = await this.connection.getRepository('Thread').find({
        relations: ['creator']
      })
    } else {
      // const user = await this.connection.getRepository('User').findOne({
      //   where: { username: username }
      // })
      // if (!user) {
      //   throw new NotFoundException('This user does not exist!!')
      // }
      // const userId = user.id

      threads = this.connection
        .getRepository('Thread')
        .createQueryBuilder('thread')
        .leftJoinAndSelect('thread.creator', 'creator')
        .where('creator.username LIKE :username', { username: `%${username}%` })
        .getMany()
    }
    return threads
  }

  async search(id: number) {
    const threads = await this.connection.getRepository('Thread').find({
      where: { id: id }
    })
    return threads
  }

  async findAll(userId: number, threadId: number, page: number, limit: number): Promise<any> {
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
    const take = limit ? limit : 10
    page = page ? page : 1
    const [messages, total] = await this.connection.getRepository('Message').findAndCount({
      relations: ['replyTo', 'thread'],
      where: { thread: { id: threadId } },
      take,
      skip: (page - 1) * take,
      order: { id: 'DESC' }
    })
    const orderedMessages = messages.reverse();
    return {
      data: orderedMessages,
      meta: {
        page,
        total_page: Math.ceil(total / take)
      }
    }
    // return messages
  }

}
