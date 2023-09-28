import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerEntity } from 'src/entities/mailer.entity';
import { MailerController } from './mailer.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([MailerEntity]), HttpModule],
  providers: [MailerService],
  controllers: [MailerController],
})
export class MailerModule {}
