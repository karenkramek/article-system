import { Expose } from 'class-transformer';

export class ArticleAuthorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
