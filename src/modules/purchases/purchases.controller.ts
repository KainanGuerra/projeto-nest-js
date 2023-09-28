import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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

  @Get()
  async find(@Req() req: any) {
    if (req.user.role === ERolesToUsers.ADMIN)
      return this.purchasesService.findAll();
    throw new AppError(`You are not allowed to access this route`, 401);
  }

  @Post()
  async createPurchase(
    @Query() query: string,
    @Body() body: PurchaseProductsPayloadDTO,
    @Req() req: Request,
  ) {
    const payload = { query, data: body, req };
    return this.purchasesService.store(payload);
  }
}
