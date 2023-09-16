import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EProductsTypes } from 'src/utils/enums/products-types.enum';

export class UpdateProductDTO {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsString()
  brand?: string;

  @IsNumber()
  value?: number;

  @IsString()
  type?: EProductsTypes;

  @IsString()
  color?: string;
}
