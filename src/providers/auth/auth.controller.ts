import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TValidateUserBody } from 'src/shared/utils/types/validate-user-body.type';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Req() req: any) {
    return await this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('validate')
  async validate(@Body() body: TValidateUserBody) {
    return await this.authService.validateUser(body);
  }
}
