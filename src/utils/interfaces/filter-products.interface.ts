import { EProductsTypes } from '../enums/products-types.enum';
import { ESneakersBrands } from '../enums/sneakers-brands.enum';
import { TFilterProductsPriceRange } from '../types/filter-product-price-range.type';

export interface IFilterProductsByParams {
  type?: EProductsTypes;
  brand?: ESneakersBrands;
  color?: string;
  priceRange?: TFilterProductsPriceRange;
  limit?: number;
  page?: number;
}
