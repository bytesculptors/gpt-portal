import { IsEmail, IsEnum, IsString } from "class-validator";
import { Role } from "../../role/role.enum";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    password: string

    @IsEnum(Role)
    role: string
}
