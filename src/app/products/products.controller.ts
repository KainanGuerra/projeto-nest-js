import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDTO } from 'src/utils/dto/products/update-product.dto';
import { CreateProductDTO } from 'src/utils/dto/products/create-product.dto';
import { IFilterProductsByParams } from 'src/utils/interfaces/filter-products.interface';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
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

  @Get('filter')
  async filter(
    @Query(new ValidationPipe({ transform: true }))
    query: IFilterProductsByParams,
  ) {
    return await this.productsService.filter(query);
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
