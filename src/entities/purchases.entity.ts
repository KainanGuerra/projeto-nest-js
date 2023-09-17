import { EPurchaseStatus } from 'src/utils/enums/purchase-dictionary.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './user.entity';

@Entity({ name: 'purchases' })
export class PurchasesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', array: true, default: [] })
  products: number[];

  @Column()
  discount: number;

  @Column({ name: 'raw_value' })
  rawValue: number;

  @Column({ name: 'final_value' })
  finalValue: number;

  @Column()
  status: EPurchaseStatus;

  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  user: UsersEntity;
}
