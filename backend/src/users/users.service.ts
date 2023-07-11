import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
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

  findUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneUser(data: FindOneOptions<User>) {
    return this.userRepository.findOne(data);
  }

  findManyUsers(data: FindManyOptions<User>) {
    return this.userRepository.find(data);
  }

  // findUserByUserInfo(findUserDto: FindUserDto) {
  //   const { username, email } = findUserDto;
  //   if (!findUserDto) {
  //     throw new BadRequestException();
  //   } else if (username && email) {
  //     return this.userRepository.findOne({
  //       where: { username: username, email: email },
  //     });
  //   } else if (!email) {
  //     return this.findUserByUsername(username);
  //   }
  //   return this.userRepository.findOneBy({ email });
  // }

 async findUserByUserInfo(data: string) {
    return this.findManyUsers({
      where: [{ username: data }, { email: data }],
    });
  }


  async createUser(data: CreateUserDto) {
    //const checkIfUserExists = await this.findUserByUserInfo(createUserDto);

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

  async findUserWishes(id: number) {
    const requestedUser = await this.findOne(id);
    if (!requestedUser) {
      throw new NotFoundException('Пользователя не существует');
    }
    return this.wishesService.findWishesById(id);
  }

  async findWishesBasedOnUsername(username: string) {
    const requestedUser = await this.findUserByUsername(username);

    if (!requestedUser) {
      throw new NotFoundException('Пользователя не существует');
    }
    return this.wishesService.findWishesById(requestedUser.id);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    createUserDto: CreateUserDto,
  ) {
    const checkIfUsernameExists = await this.findUserByUsername(
      createUserDto.username,
    );
    if (checkIfUsernameExists) {
      throw new ForbiddenException('Имя пользователя занято');
    }

    const checkIfEmailExists = await this.findUserByEmail(createUserDto.email);
    if (checkIfEmailExists) {
      throw new ForbiddenException(
        'Пользователь с такой почтой уже зарегистрирован',
      );
    }

    const { password } = updateUserDto;
    if (password) {
      const hash = await hashPassword(password);
      const user = await this.userRepository.update(id, {
        ...updateUserDto,
        password: hash,
        updatedAt: new Date(),
      });
      return user;
    } else {
      return await this.userRepository.update(id, {
        ...updateUserDto,
        updatedAt: new Date(),
      });
    }
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
