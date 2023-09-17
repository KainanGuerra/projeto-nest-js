import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from 'src/utils/dto/users/create-user.dto';
import { UpdateUserDTO } from 'src/utils/dto/users/update-user.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getStatus() {
    const serverStatus = 'Running';
    const version = '1.0.0';
    const message = 'NestJS Server is up and running.';

    return {
      status: serverStatus,
      version,
      message,
    };
  }

  @Get('/list')
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async store(@Body() body: CreateUserDTO) {
    return await this.usersService.store(body);
  }

  @Get('/id')
  async show(@Param('id') id: string) {
    return await this.usersService.findOneOrFail({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return await this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: string) {
    return this.usersService.destroy(id);
  }
}
