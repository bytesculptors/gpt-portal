import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { CreateThreadDto } from 'src/thread/dto/create-thread.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    thread: CreateThreadDto
}
