import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs'
import { generateToken } from '../token/generateTokenForEmail';

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

  async findAll() {
    // return `This action returns all user`;
    const users = await this.connection.getRepository('User').find({
      relations: ['threadsCreated']
    })
    return users
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
