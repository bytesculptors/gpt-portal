import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, BadRequestException, ValidationPipe, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../role/role.enum';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Admin: create/register a new user
  @Post('')
  @ApiCreatedResponse({ description: 'User registered successfully!!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const user = await this.userService.verifyEmail(token)
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }
    return { message: 'Email verified successfully' };
  }

  // Admin: find all users
  @Get('')
  @ApiOkResponse({ description: 'All users found!!' })
  @ApiNotFoundResponse({ description: 'Cannot find any users' })

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  findAll(@Query('page') page: number, @Query('limit') limit: number): Promise<User[]> {
    return this.userService.findAll(page, limit);
  }

  // Admin: deactivate an user
  @Patch('deactivate/:id')
  @ApiOkResponse({ description: 'User deactivated!!' })
  @ApiForbiddenResponse({ description: 'You do not have permission to do that!!' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  deactivate(@Param('id') id: number) {
    return this.userService.deactivate(id)
  }

  // User: find their own threads
  @Get('threads')
  @ApiOkResponse({ description: 'Threads found!!' })
  @ApiNotFoundResponse({ description: 'Cannot find any threads' })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  findOwnThread(@Request() req) {
    const userId = req.user.id
    return this.userService.findOwnThread(userId)
  }
}
