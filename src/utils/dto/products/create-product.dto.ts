import { IsNumber, IsString } from 'class-validator';
import { EProductsTypes } from 'src/utils/enums/products-types.enum';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsString()
  type: EProductsTypes;
}
