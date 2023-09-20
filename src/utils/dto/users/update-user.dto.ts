import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { regexHelper } from 'src/helpers/regex.helpers';

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(regexHelper.password)
  password?: string;

  @IsOptional()
  @IsNumber()
  sales_count?: number;
}
