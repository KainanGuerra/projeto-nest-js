import { Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async processPurchaseOnAwaitingPayment(
    @Query('payment_id') id: any,
    @Req() req: any,
  ) {
    console.log(req, id);
    return null;
  }
}
