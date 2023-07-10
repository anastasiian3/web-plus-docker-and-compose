import {
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, {
    message: 'Необходимо минимум 2 символа',
  })
  @MaxLength(30, {
    message: 'Необходимо максимум 30 символов',
  })
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(2, {
    message: 'Необходимо минимум 2 символа',
  })
  @MaxLength(30, {
    message: 'Необходимо максимум 30 символов',
  })
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
