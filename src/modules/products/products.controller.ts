import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { IFilterProductsByParams } from 'src/shared/utils/interfaces/filter-products.interface';
import { CreateProductDTO } from 'src/shared/utils/dto/products/create-product.dto';
import { UpdateProductDTO } from 'src/shared/utils/dto/products/update-product.dto';
import { AuthorizationHeaders } from 'src/shared/handlers/AuthorizationHeader';

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

  @Post()
  async create(@Body() body: CreateProductDTO, @Req() req: any) {
    AuthorizationHeaders.innerAuthCheck(req);
    return await this.productsService.createProduct(body);
  }
  @Put()
  async update(
    @Query('id') id: number,
    @Body() body: UpdateProductDTO,
    @Req() req: any,
  ) {
    AuthorizationHeaders.innerAuthCheck(req);
    return await this.productsService.update(id, body);
  }
  @Delete()
  async delete(@Query('id') id: number, @Req() req: any) {
    AuthorizationHeaders.innerAuthCheck(req);
    return await this.productsService.delete(id);
  }
}
