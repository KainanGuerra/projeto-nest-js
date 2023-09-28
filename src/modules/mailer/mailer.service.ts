import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerEntity } from 'src/entities/mailer.entity';
import { SaveMailDTO } from 'src/shared/utils/dto/mailer/body-save-mail.dto';
import { HttpService } from '@nestjs/axios';
import { SendEmailInterface } from 'src/shared/utils/interfaces/send-grid-mail-body.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MailerService {
  constructor(
    @InjectRepository(MailerEntity)
    private readonly mailRepository: Repository<MailerEntity>,
    private readonly httpService: HttpService,
  ) {}

  async save(data: SaveMailDTO): Promise<MailerEntity> {
    return this.mailRepository.save(this.mailRepository.create(data));
  }

  async sendEmail(data: SendEmailInterface): Promise<boolean> {
    const url = 'https://api.sendgrid.com/v3/mail/send';
    const config = {
      headers: {
        Authorization:
          'Bearer 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',
      },
    };

    const response = await lastValueFrom(
      this.httpService.post(url, data, config),
    );
    return response.status === HttpStatus.ACCEPTED;
  }
}
