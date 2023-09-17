import { Controller, Get } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('api/v1/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  async find() {
    return this.purchasesService.findAll();
  }
}
