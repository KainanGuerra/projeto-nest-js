import { EProductsTypes } from 'src/shared/utils/enums/products-types.enum';
import { ESneakersBrands } from 'src/shared/utils/enums/sneakers-brands.enum';
import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column()
  value: number;

  @Column()
  type: EProductsTypes;

  @Column({ nullable: true })
  brand?: ESneakersBrands;

  @Column()
  color: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  photo: string;
}
