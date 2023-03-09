import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { CommentsService } from './comments/comments.service';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [NewsController],
  providers: [CommentsService, NewsService],
  imports: [CommentsModule, MailModule],
})
export class NewsModule {}
