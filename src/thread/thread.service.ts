import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ThreadService {
  constructor(
    private connection: DataSource
  ) { }
  async create(createThreadDto: CreateThreadDto, userId: number) {
    // return 'This action adds a new thread';
    const creator = await this.connection.getRepository('User').findOneBy({ id: userId })
    const thread = this.connection.getRepository('Thread').create({
      title: createThreadDto.title,
      creator: creator
    })
    await this.connection.getRepository('Thread').save(thread)
    return thread
  }

  findAll() {
    return `This action returns all thread`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thread`;
  }

  async update(id: number, updateThreadDto: UpdateThreadDto, userId: number) {
    // return `This action updates a #${id} thread`;
    const thread = await this.connection.getRepository('Thread').findOne({
      where: { id: id },
      relations: ['creator']
    })
    if (!thread) {
      throw new NotFoundException('User not found!!')
    }
    if (thread.creator.id !== userId) {
      throw new UnauthorizedException('You are not admin of this thread!!')
    }
    const memberId = updateThreadDto.memberId
    const member = await this.connection.getRepository('User').findOneBy({ id: memberId })
    if (!member) {
      throw new NotFoundException('This member has not been registered yet!!')
    }
    thread.members = []
    thread.members.push(member)
    return thread
  }

  remove(id: number) {
    return `This action removes a #${id} thread`;
  }
}
