import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.createWish(req.user.userId, createWishDto);
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findWishById(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(+id, req.user, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(+id, req.user);
  }
}
