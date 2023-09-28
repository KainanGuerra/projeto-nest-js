import { ProductsEntity } from 'src/entities/products.entity';

const sumProductsValue = (products: ProductsEntity[]): number => {
  return products.reduce((total, product) => total + product.value, 0);
};
const calculateFinalValue = (rawValue: number, discount: number): number => {
  return rawValue - discount;
};
export const HProductsFunctions = {
  sumProductsValue,
  calculateFinalValue,
};
