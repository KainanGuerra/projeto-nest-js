import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TValidateUserBody } from 'src/utils/types/validate-user-body.type';

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

  // @UseGuards(AuthGuard('jwt'))
  // @Get('user')
  // async getUserByToken(@Req() req: any) {
  //   return req.user;
  // }
}
