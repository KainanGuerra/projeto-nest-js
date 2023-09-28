import { EProductsTypes } from 'src/shared/utils/enums/products-types.enum';
import { ESneakersBrands } from 'src/shared/utils/enums/sneakers-brands.enum';
import { Entity } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  value: number;

  @Column()
  type: EProductsTypes;

  @Column()
  brand: ESneakersBrands;

  @Column()
  color: string;
}
