import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SaveMailDTO } from 'src/shared/utils/dto/mailer/body-save-mail.dto';

@Controller('api/v1/mails')
export class MailerController {
  constructor(private readonly mailService: MailerService) {}
  @Get()
  async getStatus() {
    const serverStatus = 'Running';
    const version = '1.0.0';
    const message = 'SendGrip is up and running.';

    return {
      status: serverStatus,
      version,
      message,
      framework: 'Nest.js',
    };
  }

  @Post()
  async store(@Body() data: SaveMailDTO) {
    return this.mailService.save(data);
  }
}
