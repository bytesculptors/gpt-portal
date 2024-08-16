import { PartialType } from '@nestjs/mapped-types';
import { CreateThreadDto } from './create-thread.dto';
import { IsString } from 'class-validator';

export class UpdateThreadDto extends PartialType(CreateThreadDto) {
    @IsString()
    title: string

    @IsString()
    context?: string
}
