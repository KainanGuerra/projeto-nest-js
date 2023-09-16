import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/utils/dto/create-user.dto';
import { UpdateUserDTO } from 'src/utils/dto/update-user.dto';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findAll() {
    return await this.usersRepository.find({ select: ['id', 'email', 'name'] });
  }
  async findOneOrFail(conditions: { id?: string; email?: string }) {
    try {
      return await await this.usersRepository.findOneByOrFail({
        ...conditions,
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async store(data: CreateUserDTO) {
    try {
      const user = await this.usersRepository.create(data);
      return await this.usersRepository.save(user);
    } catch (err) {
      return {
        message: 'Error',
        err: `${err.message}`,
        status: 500,
      };
    }
  }

  async update(id: string, data: UpdateUserDTO) {
    const user = await this.usersRepository.findOneByOrFail({ id });
    this.usersRepository.merge(user, data);
    return this.usersRepository.save(user);
  }
  async destroy(id: string) {
    await this.usersRepository.findOneByOrFail({ id });
    this.usersRepository.softDelete({ id });
  }
}
