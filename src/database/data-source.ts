import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';
import { Permission } from '../permissions/entities/permission.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'article_system',
  entities: [User, Article, Permission],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Importante: false em produção, use migrations
  logging: process.env.NODE_ENV === 'development',
});
