import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/status')
export class AppController {
  @Get()
  async getStatus() {
    const serverStatus = 'Running';
    const version = '1.2.6';
    const message = 'Backend Server is up and running.';

    return {
      status: serverStatus,
      version,
      message,
      framework: 'Nest.js',
    };
  }
}
