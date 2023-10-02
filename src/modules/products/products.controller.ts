import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { IFilterProductsByParams } from 'src/shared/utils/interfaces/filter-products.interface';
import { CreateProductDTO } from 'src/shared/utils/dto/products/create-product.dto';
import { UpdateProductDTO } from 'src/shared/utils/dto/products/update-product.dto';
import { AuthorizationHeaders } from 'src/shared/handlers/AuthorizationHeader';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: CreateProductDTO,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    AuthorizationHeaders.innerAuthCheck(req);
    console.log(file);
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

  @Post('upload')
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
    @Query('id') id: number,
    @Req() req: any,
  ) {
    try {
      await this.productsService.findById(id);
      await AuthorizationHeaders.innerAuthCheck(req);
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
