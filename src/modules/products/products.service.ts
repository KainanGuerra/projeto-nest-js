import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/entities/products.entity';
import { HFilterFormatter } from 'src/shared/helpers/filter-format-query.helper';
import { CreateProductDTO } from 'src/shared/utils/dto/products/create-product.dto';
import { UpdateProductDTO } from 'src/shared/utils/dto/products/update-product.dto';
import { IFilterProductsByParams } from 'src/shared/utils/interfaces/filter-products.interface';
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

  async filter(query: IFilterProductsByParams) {
    let { limit } = query;

    if (!limit) {
      limit = 15;
    } else {
      limit = limit < 15 ? 15 : limit;
      limit = limit > 100 ? 100 : limit;
    }

    const { page } = query;

    const currentPage = Number(page > 0 ? page : 1);
    const offset = limit * (currentPage - 1);
    const filters = HFilterFormatter.formatQueryFilterForProduct(query);
    const productsFiltered = await this.productsRepository.findAndCount({
      take: limit,
      skip: offset,
      where: filters,
      order: {
        id: 'DESC',
      },
    });

    return {
      page: currentPage,
      totalPages: Math.ceil(productsFiltered[1] / limit),
      docsShown: productsFiltered[0].length,
      totalDocs: productsFiltered[1],
      docs: productsFiltered,
    };
  }
}
