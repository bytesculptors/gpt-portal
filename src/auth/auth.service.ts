import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private connection: DataSource,
    private jwtService: JwtService
  ) { }
  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.connection.getRepository('User').findOneBy({ username: username })

    if (!user) {
      throw new NotFoundException('This user does not exist!')
    }
    const isValidPass = await bcrypt.compare(password, user.password)
    if (!isValidPass) {
      throw new UnauthorizedException('Wrong password!!')
    }
    const payload = { id: user.id, username: user.username, role: user.role }
    console.log(payload);

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
