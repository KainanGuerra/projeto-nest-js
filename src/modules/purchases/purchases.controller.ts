import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '@nestjs/passport';
import { ERolesToUsers } from 'src/shared/utils/enums/roles-to-users.enum';
import { AppError } from 'src/shared/handlers/AppError';
import { PurchaseProductsPayloadDTO } from 'src/shared/utils/dto/purchases/purchase-items-payload.dto';
import { ErrorHandler } from 'src/shared/handlers/ErrorHandler';

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

  @Post()
  async createPurchase(
    @Body() body: PurchaseProductsPayloadDTO,
    @Req() req: any,
  ) {
    try {
      const payload = { data: body, user: req.user };
      return await this.purchasesService.createPurchase(payload);
    } catch (err) {
      ErrorHandler(err);
    }
  }
}
