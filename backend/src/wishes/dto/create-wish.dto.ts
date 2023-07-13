import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1, {
    message: 'Необходимо ввести минимум 1 символ',
  })
  @MaxLength(250, {
    message: 'Необходимо ввести максимум 250 символов',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  raised?: number;

  @IsString()
  @MinLength(1, {
    message: 'Необходимо ввести минимум 1 символ',
  })
  @MaxLength(1024, {
    message: 'Необходимо ввести максимум 1024 символа',
  })
  description?: string;
}
