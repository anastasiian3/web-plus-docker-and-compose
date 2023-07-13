import {
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsEmail,
  IsOptional
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Необходимо минимум 2 символа',
  })
  @MaxLength(30, {
    message: 'Необходимо максимум 30 символов',
  })
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Необходимо минимум 2 символа',
  })
  @MaxLength(30, {
    message: 'Необходимо максимум 30 символов',
  })
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
