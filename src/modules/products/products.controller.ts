import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { IFilterProductsByParams } from 'src/shared/utils/interfaces/filter-products.interface';
import { CreateProductDTO } from 'src/shared/utils/dto/products/create-product.dto';
import { UpdateProductDTO } from 'src/shared/utils/dto/products/update-product.dto';
import { AuthorizationHeaders } from 'src/shared/handlers/AuthorizationHeader';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

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
  async create(@Body() body: CreateProductDTO, @Req() req: any) {
    await AuthorizationHeaders.rejectUserClient(req);
    return await this.productsService.createProduct(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async update(
    @Query('id') id: number,
    @Body() body: UpdateProductDTO,
    @Req() req: any,
  ) {
    await AuthorizationHeaders.rejectUserClient(req);
    return await this.productsService.update(id, body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async delete(@Query('id') id: number, @Req() req: any) {
    await AuthorizationHeaders.rejectUserClient(req);
    return await this.productsService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: number,
    @Req() req: any,
  ) {
    await AuthorizationHeaders.rejectUserClient(req);
    try {
      await this.productsService.findById(id);
      const response = await this.productsService.upload(file, id);
      return {
        link: response,
        status: 201,
        message: 'Image uploaded sucessfully',
      };
    } catch (err) {
      throw err;
    }
  }
}
