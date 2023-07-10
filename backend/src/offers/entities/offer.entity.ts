import { IsBoolean, IsNumber } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { EntityDefault } from 'src/utils/utils.entities';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends EntityDefault {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
}
