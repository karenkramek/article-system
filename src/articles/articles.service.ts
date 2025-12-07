import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    author: User,
  ): Promise<Article> {
    const article = this.articlesRepository.create({
      ...createArticleDto,
      author,
    });

    return this.articlesRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find({ relations: ['author'] });
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: User,
  ): Promise<Article> {
    const article = await this.findOne(id);

    // Check if user is the author or has admin permission
    const isAdmin = user.permissions.some((p) => p.name === 'admin');
    const isAuthor = article.author.id === user.id;

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException('You can only edit your own articles');
    }

    Object.assign(article, updateArticleDto);

    return this.articlesRepository.save(article);
  }

  async remove(id: string, user: User): Promise<void> {
    const article = await this.findOne(id);

    // Check if user is the author or has admin permission
    const isAdmin = user.permissions.some((p) => p.name === 'admin');
    const isAuthor = article.author.id === user.id;

    if (!isAdmin && !isAuthor) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await this.articlesRepository.remove(article);
  }
}
