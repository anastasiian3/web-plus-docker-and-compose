import {
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Необходим минимум 1 символ',
  })
  @MaxLength(30, {
    message: 'Необходимо максимум 30 символов',
  })
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @MaxLength(1500, {
    message: 'Необходимо максимум 1500 символов',
  })
  description: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @OneToMany(() => Wish, (Wish) => Wish.wishlist)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
