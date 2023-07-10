import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
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

  async createWishlist(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishRepository.find({
      where: { id: In(createWishlistDto.itemsId) },
    });

    const newWishlist = this.wishlistRepository.create({
      ...CreateWishlistDto,
      items: wishes,
      owner: user,
    });

    return this.wishlistRepository.save(newWishlist);
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: { owner: true, items: true },
    });
  }

  async findOneById(id: number) {
    return await this.wishlistRepository.findOneBy({ id });
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
    const { name, description, image } = updateWishlistDto;
    return await this.wishlistRepository.save({
      ...wishlist,
      name,
      description,
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
