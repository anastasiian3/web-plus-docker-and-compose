import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly wishesService: WishesService,
  ) {}

  async createWishlist(userId: number, createWishlistDto: CreateWishlistDto) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId?.map((id) => ({ id }));
    console.log(items);
    const wishList = this.wishlistRepository.create({
      ...rest,
      items: items,
      owner: { id: userId },
    });
    return this.wishlistRepository.save(wishList);
  }

  findMany(query: FindManyOptions<Wishlist>) {
    return this.wishlistRepository.find(query);
  }

  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistRepository.findOne(query);
  }

  async getAllWishlists() {
    const wishLists = await this.findMany({
      relations: { owner: true, items: true },
    });

    wishLists.forEach((wishList) => {
      delete wishList.owner.password;
      delete wishList.owner.email;
    });

    return wishLists;
  }

  async findOneById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Такого списка желаний, скорее всего, не существует');
    }

    return wishlist;
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findOneById(id);
    if (!wishlist) {
      throw new NotFoundException(
        'Такого списка желаний, скорее всего, не существует',
      );
    } else if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужую запись');
    }

    const wishes = await this.wishesService.findWishlist(
      updateWishlistDto.itemsId,
    );
    const { name, image } = updateWishlistDto;
    return await this.wishlistRepository.save({
      ...wishlist,
      name,
      image,
      itemsId: wishes,
    });
  }

  async remove(user: User, id: number) {
    const wishlist = await this.findOneById(id);
    if (!wishlist) {
      throw new NotFoundException(
        'Такого списка желаний, скорее всего, не существует',
      );
    } else if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужую запись');
    }

    return await this.wishlistRepository.delete(id);
  }
}
