import {
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsNumber,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityDefault } from 'src/utils/utils.entities';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends EntityDefault {
  @Column()
  @IsString()
  @MinLength(2, {
    message: 'Необходимо минимум 2 символа',
  })
  @MaxLength(30, {
    message: 'Необходимо максимум 30 символов',
  })
  @IsNotEmpty()
  name: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  raised: number;

  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Необходим минимум 1 символ',
  })
  @MaxLength(1024, {
    message: 'Необходимо максимум 1024 символа',
  })
  description: string;

  @Column({ default: 0 })
  copied: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
