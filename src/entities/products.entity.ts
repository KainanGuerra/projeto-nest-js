import { EProductsTypes } from 'src/utils/enums/products-types.enum';
import { Entity } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column()
  type: EProductsTypes;

  @Column({ default: 'unknown' })
  brand: string;

  @Column({ default: 'undefined' })
  color: string;
}
