import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getStatus() {
    const serverStatus = 'Running';
    const version = '1.0.0';
    const message = 'Backend Server is up and running.';

    return {
      status: serverStatus,
      version,
      message,
    };
  }
}
