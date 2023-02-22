import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { News, NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {

  }

  @Get('/:id')
  getNews(@Param('id') id: string): News {
    let idInt = parseInt(id);
    return this.newsService.find(idInt);
  }

  @Post()
  create(@Body() news: News): News {
    return this.newsService.create(news);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): string {
    let idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'Новость удалена' : 'Передан не верный id'
  }

}
