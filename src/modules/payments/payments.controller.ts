import { Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async processPurchaseOnAwaitingPayment(
    @Query('purchase_id') purchase_id: number,
    @Req() req: any,
  ) {
    console.log(purchase_id, req);
    return null;
    //  await this.paymentsService.executeConciliation({
    //   user: req.user,
    //   purchase_id,
    // });
  }
}
