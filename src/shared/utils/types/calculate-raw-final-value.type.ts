import { ProductsEntity } from 'src/entities/products.entity';

export type TCalculateRawFinalValue = {
  discount: number;
  productsFound: ProductsEntity[];
  missingIds: number[];
};
