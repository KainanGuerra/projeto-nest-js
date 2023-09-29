import { UsersEntity } from 'src/entities/user.entity';
import { PurchaseProductsPayloadDTO } from '../dto/purchases/purchase-items-payload.dto';

export interface IPurchaseProducts {
  data: PurchaseProductsPayloadDTO;
  user: UsersEntity;
}
