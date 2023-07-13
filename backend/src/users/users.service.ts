import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { FindUserDto } from './dto/find-user.dto';
import { BadRequestException } from 'src/utils/bad-request';
import { hashPassword } from 'src/utils/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private wishesService: WishesService,
  ) {}

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneUser(data: FindOneOptions<User>) {
    return this.userRepository.findOne(data);
  }

  findManyUsers(data: FindManyOptions<User>) {
    return this.userRepository.find(data);
  }
  
  findUserByUsername(username: string) {
    return this.findOneUser({ where: { username },
    });
  }

  async findUserWishes(userId: number) {
    console.log(userId);
    const user = await this.findOneUser({
      where: { id: userId },
      relations: {
        wishes: { owner: true },
      },
    });

    return user.wishes;
  }

  async findWishesOfOthers(username: string) {
    const user = await this.findOneUser({
      where: { username },
      relations: { wishes: true },
    });

    return user.wishes;
  }

  async findUserByUserInfo(query: string): Promise<any[]> {
    const users = await this.userRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
    for (const user of users) {
      delete user.password;
    }
    return users;
  }

  async createUser(data: CreateUserDto) {
    const { username, email } = data;
    if (await this.findOneUser({ where: [{ email }, { username }] })) {
      throw new ForbiddenException(
        'Пользователь с такой почтой или логином уже существует',
      );
    }
    const { password, ...rest } = data;
    const hash = await hashPassword(password);
    return this.userRepository.save({ password: hash, ...rest });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const findUserByEmail = await this.findUserByEmail(updateUserDto.email);
      if (findUserByEmail) {
        throw new ForbiddenException(
          'Пользователь с таким email уже существует',
        );
      }
    }
    if (updateUserDto.username) {
      const findUserByUsername = await this.findUserByUsername(updateUserDto.username);
      if (findUserByUsername) {
        throw new ForbiddenException(
          'Пользователь с таким именем уже существует',
        );
      }
    }
    const { password } = updateUserDto;
    if (password) {
      return this.userRepository.update(id, {
        ...updateUserDto,
        password: await hashPassword(password),
        updatedAt: new Date(),
      });
    } else return this.userRepository.update(id, {...updateUserDto, updatedAt: new Date(),});
  }
}
