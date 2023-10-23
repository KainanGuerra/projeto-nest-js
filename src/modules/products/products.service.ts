import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/entities/products.entity';
import { S3Provider } from 'src/providers/S3/S3Provider';
import { SaveFormatDTO } from 'src/providers/S3/models/S3formatDTO';
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
    @Inject(forwardRef(() => S3Provider))
    private readonly s3Service: S3Provider,
  ) {}

  async find() {
    return await this.productsRepository.find();
  }

  async findById(id: any) {
    try {
      const productFound = await this.productsRepository.findOneOrFail({
        where: { id },
      });
      return productFound;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  }

  async createProduct(data: CreateProductDTO) {
    try {
      const product = await this.productsRepository.create(data);
      return await this.productsRepository.save(product);
    } catch (err) {
      return {
        message: err.message,
        status: 400,
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
    try {
      const productsFound = await this.productsRepository
        .createQueryBuilder('products')
        .select()
        .whereInIds(ids)
        .getMany();

      const foundIds = productsFound.map((product) => product.id);
      const missingIds = ids.filter((element) => {
        const foundIdsFormatted = foundIds.toString();
        return foundIdsFormatted.indexOf(element.toString()) == -1;
      });
      return {
        productsFound,
        missingIds,
      };
    } catch (err) {
      throw err;
    }
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

  async upload(file: Express.Multer.File, id: number) {
    const bucketInfo: SaveFormatDTO = {
      Bucket: 'upload-products-photos',
      ACL: 'public-read',
      Key: `products-supply-photos-${Date.now()}-${file.size}.jpg`,
      ContentType: 'image/*',
      Body: file.buffer,
    };

    const urlUploaded = await this.s3Service.saveInS3(bucketInfo);
    await this.update(id, { photo: urlUploaded });

    return urlUploaded;
  }
}
