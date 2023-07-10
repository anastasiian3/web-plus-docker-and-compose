import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalGuard } from './local.guard';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }
}
