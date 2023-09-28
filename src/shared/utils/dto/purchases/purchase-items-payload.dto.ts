import {
  IsArray,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class PurchaseProductsPayloadDTO {
  @IsArray()
  @IsInt({ each: true, message: 'Each product ID must be an integer' })
  @IsNotEmpty({ message: 'Products array must not be empty' })
  products: number[];

  @IsDecimal()
  discount: number;

  @IsString()
  deliveryAddress: string;
}
