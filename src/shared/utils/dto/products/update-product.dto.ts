import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ESneakersBrands } from '../../enums/sneakers-brands.enum';
import { EProductsTypes } from '../../enums/products-types.enum';

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

  @IsString()
  photo?: string;
}
