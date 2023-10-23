import { IsNumber, IsString } from 'class-validator';
import { EProductsTypes } from '../../enums/products-types.enum';
import { ESneakersBrands } from '../../enums/sneakers-brands.enum';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsString()
  type: EProductsTypes;

  @IsString()
  brand: ESneakersBrands;

  @IsString()
  color: string;

  @IsString()
  size: string;
}
