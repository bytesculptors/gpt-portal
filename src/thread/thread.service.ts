import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { DataSource } from 'typeorm';
import { AddMemberDto } from './dto/add-member.dto';

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
    await this.connection.getRepository('Thread').save(thread)
    return thread
  }

  async addContext(context: string, threadId: number, userId: number) {
    const thread = await this.connection.getRepository('Thread').findOne({
      where: { id: threadId },
      relations: ['creator']
    })
    if (!thread) {
      throw new NotFoundException('This thread has not been created!!')
    }
    if (thread.creator.id !== userId) {
      throw new UnauthorizedException('You do not have permission to add context to this thread!!')
    }
    thread.context = context
    await this.connection.getRepository('Thread').save(thread)
    return thread
  }
  remove(id: number) {
    return `This action removes a #${id} thread`;
  }

  // async addMember(id: number, addMemberDto: AddMemberDto, userId: number) {
  // return `This action updates a #${id} thread`;
  // const user = await this.connection.getRepository('User').findOneBy({ id: userId })
  // if (!user.isVerified) {
  //   throw new UnauthorizedException('You must verify your email to do this!')
  // }
  // const thread = await this.connection.getRepository('Thread').findOne({
  //   where: { id: id },
  //   relations: ['creator', 'members']
  // })
  // if (!thread) {
  //   throw new NotFoundException('Thread not found!!')
  // }
  // console.log(thread);

  // if (thread.creator.id !== userId) {
  //   throw new UnauthorizedException('You are not admin of this thread!!')
  // }
  // const memberId = addMemberDto.memberId
  // const member = await this.connection.getRepository('User').findOneBy({ id: memberId })
  // if (!member) {
  //   throw new NotFoundException('This member has not been registered yet!!')
  // }
  // if (!thread.members) {
  //   thread.members = [];
  // }
  // thread.members.push(member)
  // console.log(thread);
  // await this.connection.getRepository('Thread').save(thread)
  // return thread
  // }

  async findAll() {
    // return `This action returns all thread`;
    const threads = await this.connection.getRepository('Thread').find({
      relations: ['creator']
    })
    return threads
  }

  async search(threadName: string) {
    const threads = await this.connection
      .getRepository('Thread')
      .createQueryBuilder('thread')
      .where('thread.title LIKE :threadName', { threadName: `%${threadName}%` })
      .getMany();

    return threads
  }

  findOne(id: number) {
    return `This action returns a #${id} thread`;
  }

}
