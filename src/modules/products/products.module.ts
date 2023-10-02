import { Module, forwardRef } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsEntity } from 'src/entities/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { S3Module } from 'src/providers/S3/S3Module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsEntity]),
    forwardRef(() => S3Module),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
