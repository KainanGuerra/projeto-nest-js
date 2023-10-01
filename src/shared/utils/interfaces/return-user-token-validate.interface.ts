import { ERolesToUsers } from '../enums/roles-to-users.enum';

export interface IReturnUserTokenMapped {
  email: string;
  masked_document: string;
  masked_email: string;
  name: string;
  role: ERolesToUsers;
  sales_count: number;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
