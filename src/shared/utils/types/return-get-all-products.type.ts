import { ProductsEntity } from 'src/entities/products.entity';

export type TGetAllProductsReturn = {
  productsFound: ProductsEntity[];
  missingIds: number[];
};
