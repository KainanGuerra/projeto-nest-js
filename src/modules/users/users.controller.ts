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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDTO } from 'src/shared/utils/dto/users/create-user.dto';
import { UpdateUserDTO } from 'src/shared/utils/dto/users/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async find() {
    return this.usersService.find();
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.usersService.createUser(body);
  }

  @Get('/id')
  async findById(@Query('id') id: string) {
    return await this.usersService.findOneOrFail({ id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/token')
  async findUserByToken(@Req() req: any) {
    return await this.usersService.findUserByToken({ id: req.user.id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/validate')
  async show(@Req() req: any) {
    return await this.usersService.findOneOrFail({ id: req.user.id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return await this.usersService.update(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: string) {
    return this.usersService.destroy(id);
  }
}
