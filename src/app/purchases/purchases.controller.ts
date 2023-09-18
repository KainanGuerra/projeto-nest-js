import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchaseProductsPayloadDTO } from 'src/utils/dto/purchases/purchase-items-payload.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/v1/purchases')
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async find() {
    return this.purchasesService.findAll();
  }

  @Post()
  async create(
    @Query() query: string,
    @Body() body: PurchaseProductsPayloadDTO,
    @Req() req: Request,
  ) {
    const payload = { query, data: body, req };
    await this.authService.authorizeUser(req);
    return this.purchasesService.store(payload);
  }
}
