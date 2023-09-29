import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchasesEntity } from './purchases.entity';

@Entity({ name: 'payments' })
export class PaymentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToOne(() => PurchasesEntity)
  @JoinColumn({ name: 'purchase_id', referencedColumnName: 'id' })
  purchase_id: PurchasesEntity;
}
