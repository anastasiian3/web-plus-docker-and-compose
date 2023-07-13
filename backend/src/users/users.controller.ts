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
    return this.usersService.findUserWishes(req.user.id);
  }

  @Patch('/me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(
      +req.user.id,
      updateUserDto
    );
  }

  @Post('find')
  findUserByUserInfo(@Body() findUserDto: FindUserDto) {
    const { data } = findUserDto;
    return this.usersService.findUserByUserInfo(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':username')
  findUserByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsername(username);
  }

}
