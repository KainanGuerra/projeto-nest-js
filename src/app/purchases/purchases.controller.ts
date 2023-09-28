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
import { PurchaseProductsPayloadDTO } from 'src/utils/dto/purchases/purchase-items-payload.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async find() {
    return this.purchasesService.findAll();
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
