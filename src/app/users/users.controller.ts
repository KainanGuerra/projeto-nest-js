import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/utils/dto/create-user.dto';
import { UpdateUserDTO } from 'src/utils/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

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
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDTO,
  ) {
    return await this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.destroy(id);
  }
}
