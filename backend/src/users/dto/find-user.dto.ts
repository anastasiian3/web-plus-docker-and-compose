import { IsEmail, IsString } from 'class-validator';

export class FindUserDto {
  @IsString()
  username?: string;

  @IsEmail()
  email?: string;
}
