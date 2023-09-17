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

  async find(id: any) {
    return await this.productsRepository.findOneOrFail({ where: { id } });
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

  async update(id: any, data: UpdateProductDTO) {
    const user = await this.productsRepository.findOneOrFail({ where: { id } });
    this.productsRepository.merge(user, data);
    return this.productsRepository.save(user);
  }

  async delete(id: any) {
    await this.productsRepository.findOneByOrFail({ id });
    return this.productsRepository.softDelete({ id });
  }

  async findProductsByIds(ids: number[]) {
    return await this.productsRepository
      .createQueryBuilder('products')
      .select()
      .whereInIds(ids)
      .getMany();
  }
}
