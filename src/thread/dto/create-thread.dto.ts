import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateThreadDto {
    @IsString()
    @ApiProperty({
        description: 'Title of the thread',
        type: String
    })
    title: string;
}
