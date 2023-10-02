import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Provider } from './S3Provider';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [S3Provider],
  exports: [S3Provider],
})
export class S3Module {}
