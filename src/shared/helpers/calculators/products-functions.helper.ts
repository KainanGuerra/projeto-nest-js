import { ProductsEntity } from 'src/entities/products.entity';

const sumProductsValue = (products: ProductsEntity[]): number => {
  const result = products.reduce((total, product) => total + product.value, 0);
  return result;
};
const calculateFinalValue = (rawValue: number, discount: number): number => {
  const result = rawValue - discount;
  return result;
};
export const HProductsFunctions = {
  sumProductsValue,
  calculateFinalValue,
};
