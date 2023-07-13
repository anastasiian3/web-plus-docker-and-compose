import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Header
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  findMe(@Req() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get('me/wishes')
  findMysWishes(@Req() req) {
    return this.usersService.findUserWishes(req.user.userId);
  }

  @Patch('/me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(
      +req.user.userId,
      updateUserDto
    );
  }

  @Get(':username')
  findUserByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsername(username);
  }

  @Get(':username/wishes')
  getOtherUserWishes(@Param('username') username: string) {
    return this.usersService.findWishesOfOthers(username);
  }

  @Post('find')
  findUsers(@Body('query') query: string) {
    return this.usersService.findUserByUserInfo(query);
  }
}


