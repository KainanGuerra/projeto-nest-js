import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
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
import { AppError } from 'src/shared/handlers/AppError';
import { AuthorizationHeaders } from 'src/shared/handlers/AuthorizationHeader';
import { CreateUserDeliveryAddressDTO } from 'src/shared/utils/dto/users/create-delivery-address.dto';

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

  @Post('/admin')
  async createUserAdmin(@Body() body: CreateUserDTO, @Req() req: any) {
    if (req.headers['inner-authorization'] == process.env.INNER_AUTH)
      return await this.usersService.createUserAdmin(body);
    else throw new AppError('Unauthorized', 401);
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
  async update(@Query('id') id: string, @Body() body: UpdateUserDTO) {
    return await this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Query('id') id: string, @Req() req: any) {
    AuthorizationHeaders.innerAuthCheck(req);
    return this.usersService.destroy(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('address')
  async listUserDeliveryAddress(@Req() req: any) {
    return await this.usersService.listUserDeliveryAddress(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('address')
  async createUserDeliveryAddress(
    @Body() body: CreateUserDeliveryAddressDTO,
    @Req() req: any,
  ) {
    return await this.usersService.createUserDeliveryAddress(body, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('address')
  async deleteUserDeliveryAddress(@Query() query: any, @Req() req: any) {
    return await this.usersService.deleteDeliveryAddress(query, req);
  }
}
