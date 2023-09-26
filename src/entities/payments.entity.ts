import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentsEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
