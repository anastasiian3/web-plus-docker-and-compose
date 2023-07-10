import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1, {
    message: 'Необходимо ввести минимум 1 символ',
  })
  @MaxLength(250, {
    message: 'Необходимо ввести максимум 250 символов',
  })
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @MinLength(1, {
    message: 'Необходимо ввести минимум 1 символ',
  })
  @MaxLength(1500, {
    message: 'Необходимо ввести максимум 1500 символов',
  })
  description: string;

  itemsId: number[];
}
