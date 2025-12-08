import { Expose, Type } from 'class-transformer';
import { ArticleAuthorDto } from './article-author.dto';

export class ArticleDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => ArticleAuthorDto)
  author: ArticleAuthorDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
