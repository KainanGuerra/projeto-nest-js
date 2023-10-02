import { UsersEntity } from 'src/entities/user.entity';
import { IReturnUserTokenMapped } from '../interfaces/return-user-token-validate.interface';

export const mapUserEntityToResponse = (
  user: UsersEntity,
): IReturnUserTokenMapped => {
  const {
    email,
    masked_document,
    masked_email,
    name,
    role,
    sales_count,
    id,
    createdAt,
    updatedAt,
  } = user;
  return {
    email,
    masked_document,
    masked_email,
    name,
    role,
    sales_count,
    id,
    createdAt,
    updatedAt,
  };
};
