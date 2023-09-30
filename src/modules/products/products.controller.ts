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
import { AuthGuard } from '@nestjs/passport';
import { IFilterProductsByParams } from 'src/shared/utils/interfaces/filter-products.interface';
import { CreateProductDTO } from 'src/shared/utils/dto/products/create-product.dto';
import { UpdateProductDTO } from 'src/shared/utils/dto/products/update-product.dto';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async find() {
    return await this.productsService.find();
  }

  @Get('id')
  async findById(@Query('id') id: number) {
    return await this.productsService.findById(id);
  }

  @Get('filter')
  async filter(
    @Query(new ValidationPipe({ transform: true }))
    query: IFilterProductsByParams,
  ) {
    return await this.productsService.filter(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() body: CreateProductDTO) {
    return await this.productsService.createProduct(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async update(@Param('id') id: number, @Body() body: UpdateProductDTO) {
    return await this.productsService.update(id, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async delete(@Param('id') id: number) {
    return await this.productsService.delete(id);
  }
}
