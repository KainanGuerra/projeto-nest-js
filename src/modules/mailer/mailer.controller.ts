import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SaveMailDTO } from 'src/shared/utils/dto/mailer/body-save-mail.dto';

@Controller('api/v1/mails')
export class MailerController {
  constructor(private readonly mailService: MailerService) {}

  @Post()
  async store(@Body() data: SaveMailDTO) {
    return this.mailService.save(data);
  }
}
