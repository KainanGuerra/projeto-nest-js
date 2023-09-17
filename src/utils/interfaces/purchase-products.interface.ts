import { PurchaseProductsPayloadDTO } from '../dto/purchases/purchase-items-payload.dto';

export interface IPurchaseProducts {
  query: any;
  data: PurchaseProductsPayloadDTO;
  req: Request;
}
