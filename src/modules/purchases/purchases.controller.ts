import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '@nestjs/passport';
import { ERolesToUsers } from 'src/shared/utils/enums/roles-to-users.enum';
import { AppError } from 'src/shared/handlers/AppError';
import { PurchaseProductsPayloadDTO } from 'src/shared/utils/dto/purchases/purchase-items-payload.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('/find-many')
  async findUserPurchase(@Req() req: any) {
    return this.purchasesService.findUserPurchase(req.user);
  }

  @Get()
  async find(@Req() req: any) {
    if (req.user.role === ERolesToUsers.ADMIN)
      return this.purchasesService.find();
    throw new AppError(`You are not allowed to access this route`, 401);
  }

  @Get('shop-car')
  async getUserShopCar(@Req() req: any) {
    return this.purchasesService.getUserShopCar(req);
  }

  @Get('shop-car/products')
  async getProductsFromShopCar(@Req() req: any) {
    return this.purchasesService.getProductsFromShopCar(req);
  }

  @Patch('shop-car/:id')
  async addToShopCar(@Param('id') id: any, @Req() req: any) {
    return this.purchasesService.updateShopCar(id, req);
  }

  @Patch('remove-item/:id')
  async removeItemFromShopCar(@Param('id') id: string, @Req() req: any) {
    return this.purchasesService.removeItemFromShopCar(id, req);
  }

  @Post()
  async createPurchase(
    @Body() body: PurchaseProductsPayloadDTO,
    @Req() req: any,
  ) {
    const payload = { data: body, user: req.user };
    return await this.purchasesService.createPurchase(payload);
  }
}
