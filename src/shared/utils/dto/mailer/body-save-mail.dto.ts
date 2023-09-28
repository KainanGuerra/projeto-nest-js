import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SaveMailDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@email.com' })
  destinationAddress: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2022-05-01' })
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NestJS test' })
  subject: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Kainan Guerra' })
  destinationName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '<p>Hi</p>' })
  body: string;
}
