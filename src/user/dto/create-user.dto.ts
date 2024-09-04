import { IsEmail, IsEnum, IsString } from "class-validator";
import { Role } from "../../role/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @IsEmail()
    @ApiProperty({
        description: 'Email of user',
        type: String
    })
    email: string;

    @IsString()
    @ApiProperty({
        description: 'Username of user',
        type: String
    })
    username: string;

    @IsString()
    @ApiProperty({
        description: 'Password of user',
        type: String
    })
    password: string

    @IsEnum(Role)
    @ApiProperty({
        description: 'Role of user',
        type: String,
        enum: Role
    })
    role: string
}
