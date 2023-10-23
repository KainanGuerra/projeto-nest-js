import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/entities/user.entity';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { TValidateUserBody } from 'src/shared/utils/types/validate-user-body.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UsersEntity) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: payload.email,
        role: user.role,
        document: user.masked_document,
      },
    };
  }

  async validateUser({ email, password }: TValidateUserBody) {
    let user: UsersEntity;
    try {
      user = await this.userService.findOneOrFail({ email });
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
