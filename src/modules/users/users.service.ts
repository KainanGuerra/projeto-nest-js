import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../entities/user.entity';
import { CreateUserDTO } from 'src/shared/utils/dto/users/create-user.dto';
import { UpdateUserDTO } from 'src/shared/utils/dto/users/update-user.dto';
import { AppError } from 'src/shared/handlers/AppError';
import { ErrorHandler } from 'src/shared/handlers/ErrorHandler';
import { MESSAGE_ERROR } from 'src/shared/helpers/messages/error-messages.helper';
import { mapUserEntityToResponse } from 'src/shared/utils/mappers/user-validate-token.mapper';
import { IReturnUserTokenMapped } from 'src/shared/utils/interfaces/return-user-token-validate.interface';
import { ERolesToUsers } from 'src/shared/utils/enums/roles-to-users.enum';
import { CreateUserDeliveryAddressDTO } from 'src/shared/utils/dto/users/create-delivery-address.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async find() {
    return await this.usersRepository.find({ select: ['id', 'email', 'name'] });
  }
  async findUserByToken(conditions: {
    id?: string;
    email?: string;
  }): Promise<IReturnUserTokenMapped> {
    try {
      const user = await this.usersRepository.findOneByOrFail({
        ...conditions,
      });
      return mapUserEntityToResponse(user);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async findOneOrFail(conditions: { id?: string; email?: string }) {
    try {
      const user = await this.usersRepository.findOneByOrFail({
        ...conditions,
      });
      return user;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async createUser(data: CreateUserDTO) {
    await this.checkIfExists(
      'email',
      data.email,
      MESSAGE_ERROR.EMAIL_ALREADY_IN_USE,
    );
    await this.checkIfExists(
      'document',
      data.document,
      MESSAGE_ERROR.DOCUMENT_ALREADY_IN_USE,
    );

    try {
      const user = await this.usersRepository.create(data);

      return await this.usersRepository.save(user);
    } catch (err) {
      await ErrorHandler(err);
    }
  }

  async createUserAdmin(data: CreateUserDTO) {
    await this.checkIfExists(
      'email',
      data.email,
      MESSAGE_ERROR.EMAIL_ALREADY_IN_USE,
    );
    await this.checkIfExists(
      'document',
      data.document,
      MESSAGE_ERROR.DOCUMENT_ALREADY_IN_USE,
    );
    const payload = {
      ...data,
      role: ERolesToUsers.ADMIN,
    };
    try {
      const user = await this.usersRepository.create(payload);

      return await this.usersRepository.save(user);
    } catch (err) {
      await ErrorHandler(err);
    }
  }

  async update(id: string, data: UpdateUserDTO) {
    const user = await this.usersRepository.findOneByOrFail({ id });
    await this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async destroy(id: string) {
    await this.usersRepository.findOneByOrFail({ id });
    return await this.usersRepository.softDelete({ id });
  }

  private async checkIfExists(
    fieldName: string,
    value: any,
    errorMessage: string,
  ) {
    const filter = { [fieldName]: value };
    const existingUser = await this.usersRepository.findOneBy(filter);

    if (existingUser) {
      throw new AppError(errorMessage, 400);
    }
  }

  async listUserDeliveryAddress(req: any) {
    try {
      const user = await this.usersRepository.findOneByOrFail({
        id: req.user.id,
      });
      return user.delivery_addresses;
    } catch (err) {
      throw err;
    }
  }

  async createUserDeliveryAddress(
    body: CreateUserDeliveryAddressDTO,
    req: any,
  ) {
    try {
      const user = await this.usersRepository.findOneByOrFail({
        id: req.user.id,
      });
      if (!user.delivery_addresses) {
        user.delivery_addresses = [];
      }

      const newId = user.delivery_addresses.length + 1;

      body.id = newId;

      user.delivery_addresses.push(body);

      return await this.usersRepository.save(user);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async deleteDeliveryAddress(id: any, req: any) {
    try {
      const user = await this.usersRepository.findOneByOrFail({
        id: req.user.id,
      });
      if (user.delivery_addresses) {
        user.delivery_addresses = user.delivery_addresses.filter((address) => {
          return address.id !== +id;
        });
      }
      return this.usersRepository.save(user);
    } catch (err) {
      throw err;
    }
  }
}
