import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Render,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { News, NewsService } from './news.service';
import { htmlTemplate } from '../views/template';
import { newsTemplate } from '../views/news';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from './dtos/news-id.dto/news-id.dto';
import { NewsCreateDto } from './dtos/news-create.dto/news-create.dto';
import { HelperFileLoader } from '../utils/HelperFileLoader';
import { MailService } from '../mail/mail.service';

const PATH_NEWS = '/news-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;
const imageFileFilter = (req, file, callback) => {
  const fileExtension = file.originalname.split('.').reverse()[0];
  if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/)) {
    callback(new Error('Excepted image'), false);
  }
  callback(null, true);
};

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentService: CommentsService,
    private mailService: MailService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
    }),
  )
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
  async create(
    @Body() news: NewsCreateDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    console.log(news);
    let coverPath = undefined;
    if (cover?.filename?.length > 0) coverPath = PATH_NEWS + cover.filename;
    const _news = this.newsService.create({ ...news, cover: coverPath });
    await this.mailService.sendNewNewsForAdmins(
      ['ludiky@mail.ru', 'ludiky30@gmail.com'],
      _news,
    );
    return _news;
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
