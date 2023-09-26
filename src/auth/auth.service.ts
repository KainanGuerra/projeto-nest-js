import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/users.service';
import { UsersEntity } from 'src/entities/user.entity';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/shared/AppError';
import { TValidateUserBody } from 'src/utils/types/validate-user-body.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UsersEntity) {
    const payload = { sub: user.id, email: user.email };
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

  async authorizeUser(request: any) {
    const bearer = request.headers.authorization as string;
    if (!bearer) {
      throw new AppError('Auth token is missing', 401);
    }

    const token = bearer.split(' ')[1];
    const user = this.jwtService.decode(token);
    if (user) {
      request.user = user;
    } else {
      throw new AppError('Invalid auth token', 401);
    }
  }

  async innerAuthCheck(request: any) {
    const innerAuthToken = request.headers['inner-authorization'];

    if (!innerAuthToken) throw new AppError('Auth token is missing', 401);

    if (innerAuthToken === process.env.INNER_AUTH) {
    } else {
      throw new AppError('Invalid auth token', 401);
    }
  }
}
