import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../entities/user.entity';
import { CreateUserDTO } from 'src/shared/utils/dto/users/create-user.dto';
import { UpdateUserDTO } from 'src/shared/utils/dto/users/update-user.dto';
import { AppError } from 'src/shared/handlers/AppError';
import { ErrorHandler } from 'src/shared/handlers/ErrorHandler';
import { MESSAGE_ERROR } from 'src/shared/helpers/messages/error-messages.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async find() {
    return await this.usersRepository.find({ select: ['id', 'email', 'name'] });
  }
  async findOneOrFail(conditions: { id?: string; email?: string }) {
    try {
      return await this.usersRepository.findOneByOrFail({
        ...conditions,
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async store(data: CreateUserDTO) {
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
}
