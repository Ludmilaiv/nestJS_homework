import { Injectable } from '@nestjs/common';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countViews?: number;
  cover?: string;
}

function getRandom(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {
      id: 1,
      title: 'News#1',
      description: 'lorem lorem',
      author: 'Author',
      countViews: 0,
    },
  ];

  create(news: News): News {
    const id = getRandom(0, 99999);

    const finalNews = {
      ...news,
      id: id,
    };
    this.news.push(finalNews);
    return finalNews;
  }

  find(id: News['id']): News | undefined {
    return this.news.find((news) => news.id === id);
  }

  getAll(): News[] {
    return this.news;
  }

  remove(id: News['id']): boolean {
    const indexRemoveNews = this.news.findIndex((news) => news.id === id);
    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    }
    return false;
  }

  edit(
    id: News['id'],
    news: Pick<News, 'title' | 'description' | 'countViews' | 'author'>,
  ): boolean {
    const indexEditNews = this.news.findIndex((news) => news.id === id);
    const finalNews = {
      ...this.news[indexEditNews],
      ...news,
    };
    if (indexEditNews !== -1) {
      this.news.splice(indexEditNews, 1);
      this.news.push(finalNews);
      return true;
    }
    return false;
  }
}
