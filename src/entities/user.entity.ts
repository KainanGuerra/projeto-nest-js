import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcrypt';
import { DocumentMasker } from 'src/helpers/document.masker';
import { EmailMasker } from 'src/helpers/email.masker';
import { ERolesToUsers } from 'src/utils/enums/roles-to-users.enum';
@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ unique: true })
  document: string;

  @Column({ default: ERolesToUsers.CLIENT })
  role: ERolesToUsers;

  @Column()
  masked_document: string;

  @Column()
  masked_email: string;

  @Column({ default: 0 })
  sales_count: number;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }

  @BeforeInsert()
  maskData() {
    this.masked_document = DocumentMasker.maskCpf(this.document);
    this.masked_email = EmailMasker.mask(this.email);
  }
}
