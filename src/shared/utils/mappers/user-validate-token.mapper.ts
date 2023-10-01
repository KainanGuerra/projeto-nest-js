import { UsersEntity } from 'src/entities/user.entity';

export const mapUserEntityToResponse = (user: UsersEntity) => {
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
