import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'Username of user'
    })
    readonly username: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'Password of user'
    })
    readonly password: string
}