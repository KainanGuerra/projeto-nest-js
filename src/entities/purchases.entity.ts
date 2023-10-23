import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './user.entity';
import { EPurchaseStatus } from 'src/shared/utils/enums/purchase-status-dictionary.enum';

@Entity({ name: 'purchases' })
export class PurchasesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', array: true, default: [] })
  products: number[];

  @Column({ type: 'decimal', default: 0 })
  discount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'decimal', name: 'raw_value' })
  rawValue: number;

  @Column({ type: 'decimal', name: 'final_value' })
  finalValue: number;

  @Column()
  status: EPurchaseStatus;

  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  user: UsersEntity;
}
