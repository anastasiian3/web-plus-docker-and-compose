import {
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { EntityDefault } from 'src/utils/utils.entities';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends EntityDefault {
  @Column()
  @IsString()
  @MinLength(2, {
    message: 'Необходимо минимум 2 символа',
  })
  @MaxLength(30, {
    message: 'Необходимо максимум 30 символов',
  })
  @IsNotEmpty()
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @MinLength(2, {
    message: 'Необходимо минимум 2 символа',
  })
  @MaxLength(200, {
    message: 'Необходимо максимум 200 символов',
  })
  @IsNotEmpty()
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
