import { IsNumber } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  purchase_id: number;
}
