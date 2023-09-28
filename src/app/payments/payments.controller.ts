import { Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async processPurchaseOnAwaitingPayment(
    @Query('purchase_id') purchase_id: number,
    @Req() req: any,
  ) {
    return await this.paymentsService.executeConciliation({
      user: req.user,
      purchase_id,
    });
  }
}
