import { PartialType } from '@nestjs/mapped-types';
import { CreateThreadDto } from './create-thread.dto';
import { IsEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateThreadDto extends PartialType(CreateThreadDto) {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'Title of thread'
    })
    title: string

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'Context of thread',
        nullable: true
    })
    context?: string
}
