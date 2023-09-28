import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UsersEntity } from 'src/entities/user.entity';
import { EPurchaseStatus } from '../../enums/purchase-status-dictionary.enum';

export class PurchaseItemsCreateInstanceDTO {
  @IsArray()
  @IsInt({ each: true, message: 'Each product ID must be an integer' })
  @IsNotEmpty({ message: 'Products array must not be empty' })
  products: number[];

  @IsDecimal()
  discount: number;

  @IsString()
  deliveryAddress: string;

  @IsDecimal()
  finalValue: number;

  @IsNumber()
  rawValue: number;

  @IsEnum(EPurchaseStatus)
  @IsString()
  status: EPurchaseStatus;

  @IsObject()
  @ValidateNested()
  @Type(() => UsersEntity)
  user: UsersEntity;
}
