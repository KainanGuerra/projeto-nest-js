import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from 'src/entities/payments.entity';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsEntity]), PurchasesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
