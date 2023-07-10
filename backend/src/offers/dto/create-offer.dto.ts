import { IsInt, Min } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @Min(1)
  amount: number;

  hidden: boolean;
  itemId: number;
}
