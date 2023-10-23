import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MESSAGE_ERROR } from 'src/shared/helpers/messages/error-messages.helper';
import { AuthService } from 'src/providers/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser({ email, password });
    if (!user) throw new UnauthorizedException(MESSAGE_ERROR.USER_UNAUTHORIZED);
    return user;
  }
}
