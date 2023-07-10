import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user) {
    const itemId = createOfferDto.itemId;
    const wish = await this.wishesRepository.findOne({ where: { id: itemId } });

    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Вы не можете внести деньги на собственное желание',
      );
    }
    if (!wish) {
      throw new NotFoundException('Данное желание не найдено');
    }
    if (wish.raised > wish.price)
      throw new BadRequestException(
        'Нельзя внести сумму больше, чем необходимо для осуществления желания',
      );

    this.wishesRepository.update({ id: wish.id }, wish);
    return this.offerRepository.save({ ...createOfferDto, user, itemId: wish });
  }

  findAll() {
    this.offerRepository.find();
  }

  findOne(id: number) {
    return this.offerRepository.findOneBy({ id });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto) {
    await this.offerRepository.update(id, updateOfferDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const offerToDelete = await this.findOne(id);
    await this.offerRepository.delete(id);
    return offerToDelete;
  }
}
