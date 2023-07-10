import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor() {
    super('Incorrect Request', HttpStatus.BAD_REQUEST);
  }
}
