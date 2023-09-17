import { IsNumber, IsString } from 'class-validator';
import { EProductsTypes } from 'src/utils/enums/products-types.enum';
import { ESneakersBrands } from 'src/utils/enums/sneakers-brands.enum';

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
}
