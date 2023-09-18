import { ProductsEntity } from 'src/entities/products.entity';
import { IFilterProductsByParams } from 'src/utils/interfaces/filter-products.interface';
import { Between, FindOptionsWhere } from 'typeorm';

const formatQueryFilterForProduct = (
  query: IFilterProductsByParams,
): FindOptionsWhere<ProductsEntity> | FindOptionsWhere<ProductsEntity>[] => {
  try {
    const { color, brand, type, priceRange } = query;

    const conditions: Array<any> = [];

    if (color) conditions.push({ color });
    if (brand) conditions.push({ brand });
    if (type) conditions.push({ type });
    if (priceRange) {
      const startPrice = priceRange.startPrice;
      const endPrice = priceRange.endPrice;
      conditions.push({
        value: Between(startPrice, endPrice),
      });
    }
    const reducedConditions = conditions.reduce((acc, condition) => {
      return Object.assign(acc, condition);
    }, {});

    return reducedConditions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const HFilterFormatter = {
  formatQueryFilterForProduct,
};
