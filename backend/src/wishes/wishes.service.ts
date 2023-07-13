import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async createWish(user: User, createWishDto: CreateWishDto) {
    const newWish = this.wishRepository.create({ ...createWishDto, owner: user, raised: 0 });
    return this.wishRepository.save(newWish);
  }
  

  findAll() {
    return this.wishRepository.find();
  }

  findWishById(id: number) {
    const requestedWish = this.wishRepository.findOne({
      where: { id: id },
      relations: { owner: true, offers: true },
    });
    if (!requestedWish) {
      throw new NotFoundException('Такого пожелания не существует');
    }
    return requestedWish;
  }

  async findLastWishes() {
    return this.wishRepository.find({
      order: { createdAt: 'desc' },
      take: 40,
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async findTopWishes() {
    return this.wishRepository.find({
      order: { copied: 'desc' },
      take: 20,
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async copyWish(id: number, user: User) {
    const requestedWish = await this.findWishById(id);
    if (!requestedWish) {
      throw new NotFoundException('Такого желания не существует');
    }
    if (user.id === requestedWish.owner.id)
      throw new ForbiddenException('Нельзя cкопировать свои желания');

    const { copied } = requestedWish;
    await this.wishRepository.update(id, { copied: copied + 1 });
    await this.createWish(user, { ...requestedWish, raised: 0 });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const requiredWish = await this.findWishById(id);
    if (!requiredWish) {
      throw new NotFoundException('Такого желания не существует');
    } else if (requiredWish.owner.id !== userId) {
      throw new UnauthorizedException('Вы не можете изменять чужое желание');
    }
    if (requiredWish.raised !== 0) {
      throw new ForbiddenException(
        'Нельзя менять стоимость подарка, если уже есть желающие его поддержать',
      );
    }
    return this.wishRepository.update(id, updateWishDto);
  }

  async remove(id: number, user: User) {
    const requiredWish = await this.findWishById(id);
    if (!requiredWish) {
      throw new NotFoundException('Такого желания не существует');
    } else if (requiredWish.owner.id !== user.id) {
      throw new UnauthorizedException('Нельзя удалять чужое желание');
    }

    return this.wishRepository.delete(id);
  }

  async findWishlist(list): Promise<Wish[]> {
    return await this.wishRepository.findBy(list);
  }

  public findWishesById(id: number) {
    this.wishRepository.find({
      where: { owner: { id: id } },
    });
  }
}
