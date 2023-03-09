import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { News, NewsService } from './news.service';
import { htmlTemplate } from '../views/template';
import { newsTemplate } from '../views/news';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from './dtos/news-id.dto/news-id.dto';
import { NewsCreateDto } from './dtos/news-create.dto/news-create.dto';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentService: CommentsService,
  ) {}

  @Get('/:id')
  getNews(@Param('id') params: NewsIdDto): News {
    const idInt = parseInt(params.id);
    return this.newsService.find(idInt);
  }

  @Get('/all')
  getAllNews(): News[] {
    return this.newsService.getAll();
  }

  @Post()
  create(@Body() news: NewsCreateDto): News {
    return this.newsService.create(news);
  }

  @Delete('/:id')
  remove(@Param('id') params: NewsIdDto): string {
    const idInt = parseInt(params.id);
    const isRemoved =
      this.newsService.remove(idInt) &&
      this.commentService.removeAll(params.id);
    return isRemoved ? 'Новость удалена' : 'Передан не верный id';
  }

  @Post('/:id')
  edit(
    @Param('id') id: string,
    @Body() news: Pick<News, 'title' | 'description' | 'countViews' | 'author'>,
  ): string {
    const idInt = parseInt(id);
    const editNews = this.newsService.edit(idInt, news);
    return editNews ? 'Новость изменена' : 'Передан не верный id';
  }

  @Get()
  async getViewAll(): Promise<string> {
    const news = this.newsService.getAll();
    return htmlTemplate(newsTemplate(news));
  }
}
