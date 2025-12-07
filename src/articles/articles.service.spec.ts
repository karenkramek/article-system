import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const mockArticleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createArticleDto = {
      title: 'Test Article',
      content: 'Test content',
    };

    const mockAuthor = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      permissions: [{ id: 'perm-1', name: 'editor' }],
    };

    it('should create an article successfully', async () => {
      const mockArticle = {
        id: '1',
        ...createArticleDto,
        author: mockAuthor,
      };

      mockArticleRepository.create.mockReturnValue(mockArticle);
      mockArticleRepository.save.mockResolvedValue(mockArticle);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await service.create(createArticleDto, mockAuthor as any);

      expect(result).toEqual(mockArticle);
      expect(mockArticleRepository.create).toHaveBeenCalledWith({
        ...createArticleDto,
        author: mockAuthor,
      });
      expect(mockArticleRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const mockArticles = [
        { id: '1', title: 'Article 1', author: {} },
        { id: '2', title: 'Article 2', author: {} },
      ];

      mockArticleRepository.find.mockResolvedValue(mockArticles);

      const result = await service.findAll();

      expect(result).toEqual(mockArticles);
      expect(mockArticleRepository.find).toHaveBeenCalledWith({
        relations: ['author'],
      });
    });
  });

  describe('findOne', () => {
    it('should return an article by id', async () => {
      const mockArticle = {
        id: '1',
        title: 'Test Article',
        author: {},
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);

      const result = await service.findOne('1');

      expect(result).toEqual(mockArticle);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['author'],
      });
    });

    it('should throw NotFoundException when article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const mockArticle = {
      id: '1',
      title: 'Original Title',
      content: 'Original content',
      author: { id: 'user-1', permissions: [] },
    };

    it('should update article when user is the author', async () => {
      const updateDto = { title: 'Updated Title' };
      const mockUser = {
        id: 'user-1',
        permissions: [{ name: 'editor' }],
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);
      mockArticleRepository.save.mockResolvedValue({
        ...mockArticle,
        ...updateDto,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await service.update('1', updateDto, mockUser as any);

      expect(result.title).toBe('Updated Title');
    });

    it('should update article when user is admin', async () => {
      const updateDto = { title: 'Updated by Admin' };
      const mockUser = {
        id: 'admin-1',
        permissions: [{ name: 'admin' }],
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);
      mockArticleRepository.save.mockResolvedValue({
        ...mockArticle,
        ...updateDto,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await service.update('1', updateDto, mockUser as any);

      expect(result.title).toBe('Updated by Admin');
    });

    it('should throw ForbiddenException when user is not author or admin', async () => {
      const updateDto = { title: 'Unauthorized Update' };
      const mockUser = {
        id: 'user-2',
        permissions: [{ name: 'editor' }],
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);

      await expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        service.update('1', updateDto, mockUser as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    const mockArticle = {
      id: '1',
      title: 'Test Article',
      author: { id: 'user-1', permissions: [] },
    };

    it('should delete article when user is the author', async () => {
      const mockUser = {
        id: 'user-1',
        permissions: [{ name: 'editor' }],
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);
      mockArticleRepository.remove.mockResolvedValue(mockArticle);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await service.remove('1', mockUser as any);

      expect(mockArticleRepository.remove).toHaveBeenCalledWith(mockArticle);
    });

    it('should delete article when user is admin', async () => {
      const mockUser = {
        id: 'admin-1',
        permissions: [{ name: 'admin' }],
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);
      mockArticleRepository.remove.mockResolvedValue(mockArticle);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await service.remove('1', mockUser as any);

      expect(mockArticleRepository.remove).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not author or admin', async () => {
      const mockUser = {
        id: 'user-2',
        permissions: [{ name: 'editor' }],
      };

      mockArticleRepository.findOne.mockResolvedValue(mockArticle);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await expect(service.remove('1', mockUser as any)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
