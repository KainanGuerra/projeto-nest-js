import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly oroductsService: ProductsService) {}

  @Get()
  async listAll() {}

  @Get()
  async find() {}

  @Post()
  async create() {}

  @Put()
  async update() {}

  @Delete()
  async delete() {}
}
