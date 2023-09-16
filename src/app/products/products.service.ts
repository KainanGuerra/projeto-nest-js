import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/entities/products.entity';
import { CreateProductDTO } from 'src/utils/dto/products/create-product.dto';
import { UpdateProductDTO } from 'src/utils/dto/products/update-product.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
  ) {}

  async listAll() {
    return await this.productsRepository.find();
  }

  async find() {
    return await this.productsRepository.findAndCount();
  }

  async create(data: CreateProductDTO) {
    try {
      const product = await this.productsRepository.create(data);
      return await this.productsRepository.save(product);
    } catch (err) {
      return {
        message: 'Error',
        err: `${err.message}`,
        status: 500,
      };
    }
  }

  async update(id: string, data: UpdateProductDTO) {
    const user = await this.productsRepository.findOneByOrFail({ id });
    this.productsRepository.merge(user, data);
    return this.productsRepository.save(user);
  }

  async delete(id: string) {
    await this.productsRepository.findOneByOrFail({ id });
    return this.productsRepository.softDelete({ id });
  }
}
