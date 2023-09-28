import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerEntity } from 'src/entities/mailer.entity';
import { MailerController } from './mailer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MailerEntity])],
  providers: [MailerService],
  controllers: [MailerController],
})
export class MailModule {}
