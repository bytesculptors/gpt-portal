import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSource } from 'typeorm';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs'
import { generateToken } from '../token/generateTokenForEmail';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private connection: DataSource,
    private emailService: EmailService
  ) { }
  async register(createUserDto: CreateUserDto) {
    // return 'This action adds a new user';
    const { email, username, password, role } = createUserDto
    let user
    user = await this.connection.getRepository('User').findOneBy({ email: email })
    if (user) {
      throw new HttpException('This email has been registered', HttpStatus.CONFLICT)
    }
    user = await this.connection.getRepository('User').findOneBy({ username: username })
    if (user) {
      throw new HttpException('This username has been registered', HttpStatus.CONFLICT)
    }
    const verificationToken = generateToken(16)
    const newUser = this.connection.getRepository('User').create({
      email,
      username,
      password: await bcrypt.hash(password, 10),
      role,
      verificationToken
    })
    await this.connection.getRepository('User').save(newUser)
    await this.emailService.sendVerificationEmail(email, verificationToken)
    return newUser
  }

  async verifyEmail(token: string) {
    const user = await this.connection.getRepository('User').findOneBy({ verificationToken: token })
    if (!user) {
      throw new BadRequestException('Invalid verification token')
    }
    user.isVerified = true
    user.verificationToken = null
    await this.connection.getRepository('User').save(user)
    return user
  }

  async findAll(page: number, limit: number): Promise<any> {
    // return `This action returns all user`;
    const take = limit ? limit : 10
    const [users, total] = await this.connection.getRepository('User').findAndCount({
      relations: ['threadsCreated'],
      take,
      skip: (page - 1) * take
    })
    page = page ? page : 1
    return {
      data: users,
      meta: {
        page,
        total_page: Math.ceil(total / take)
      }
    }

  }

  async deactivate(id: number) {
    const user = await this.connection.getRepository('User').findOneBy({ id: id })
    if (!user) {
      throw new NotFoundException('This user has not registered yet!!')
    }
    user.isVerified = false
    await this.connection.getRepository('User').save(user)
    return user
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
}
