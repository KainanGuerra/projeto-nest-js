import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDeliveryAddressDTO {
  @IsNumber()
  @IsOptional()
  id?: number;
  @IsString()
  city: string;
  @IsString()
  country: string;
  @IsString()
  state: string;
  @IsString()
  street: string;
  @IsString()
  number: string;
  @IsString()
  zipCode: string;
  @IsString()
  @IsOptional()
  complement?: string;
  @IsOptional()
  @IsString()
  nickname?: string;
}
