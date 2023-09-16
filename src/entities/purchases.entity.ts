import { EPurchaseStatus } from 'src/utils/enums/purchase-dictionary.enum';
import { TPurchaseItems } from 'src/utils/types/payload.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Purchases {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  products: TPurchaseItems;

  @Column({ name: 'final_value' })
  finalValue: number;

  @Column()
  status: EPurchaseStatus;

  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column()
  discount: number;
}
