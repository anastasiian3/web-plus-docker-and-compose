import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  login(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    let ifValuesMatched = false;
    await bcrypt.compare(password, user.password).then((isAMatch) => {
      if (!isAMatch) return null;
      ifValuesMatched = true;
    });

    if (user && ifValuesMatched) {
      const { password, ...res } = user;
      return res;
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }
}
