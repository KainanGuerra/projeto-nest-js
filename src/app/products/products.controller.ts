import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from 'src/utils/dto/products/create-product.dto';
import { UpdateProductDTO } from 'src/utils/dto/products/update-product.dto';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listAll() {
    return await this.productsService.listAll();
  }

  @Get('find')
  async find(@Param('id') id: number) {
    return await this.productsService.find(id);
  }

  @Post()
  async create(@Body() body: CreateProductDTO) {
    return await this.productsService.create(body);
  }

  @Put()
  async update(@Param('id') id: number, @Body() body: UpdateProductDTO) {
    return await this.productsService.update(id, body);
  }

  @Delete()
  async delete(@Param('id') id: number) {
    return await this.productsService.delete(id);
  }
}
