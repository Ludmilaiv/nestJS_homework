import { Injectable } from '@nestjs/common';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countViews: number
}

function getRandom(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {id: 1, title: "News#1", description: "lorem lorem", author: "Author", countViews: 0}
  ];

  create(news: News): News {
    const id = getRandom(0, 99999);

    const filalNews = {
      ...news,
      id: id,
    }
    this.news.push(filalNews);
    return filalNews;
  }

  find(id: News['id']): News | undefined {
    return this.news.find((news) => news.id === id);
  }

  remove(id: News['id']): Boolean {
    const indexRemoveNews = this.news.findIndex((news) => news.id === id);
    if (indexRemoveNews !== -1) {
      this.news.splice(indexRemoveNews, 1);
      return true;
    } 
    return false;
    
  }
}
