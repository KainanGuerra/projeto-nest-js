import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EProductsTypes } from 'src/utils/enums/products-types.enum';
import { ESneakersBrands } from 'src/utils/enums/sneakers-brands.enum';

export class UpdateProductDTO {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsString()
  brand?: ESneakersBrands;

  @IsNumber()
  value?: number;

  @IsString()
  type?: EProductsTypes;

  @IsString()
  color?: string;
}
