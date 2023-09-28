import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsEntity } from 'src/entities/payments.entity';
import { Repository } from 'typeorm';
import { PurchasesService } from '../purchases/purchases.service';
import { EPurchaseStatus } from 'src/shared/utils/enums/purchase-status-dictionary.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsEntity)
    private readonly paymentsRepository: Repository<PaymentsEntity>,
    @Inject(forwardRef(() => PurchasesService))
    private readonly purchasesService: PurchasesService,
  ) {}

  async executeConciliation({ user, purchase_id }) {
    console.log(user, purchase_id);
    const paymentObject = { purchase_id };
    await this.paymentsRepository.create(paymentObject);
    return await this.purchasesService.updatePurchase({
      id: purchase_id,
      status: EPurchaseStatus.PAID,
    });
  }
}
