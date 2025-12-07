import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PermissionsService } from '../permissions/permissions.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPermissionsService = {
    findByNames: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      permissions: ['admin'],
    };

    it('should create a new user successfully', async () => {
      const mockPermissions = [{ id: 'perm-1', name: 'admin' }];
      const hashedPassword = 'hashedPassword';

      mockUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPermissionsService.findByNames.mockResolvedValue(mockPermissions);
      mockUserRepository.create.mockReturnValue({
        ...createUserDto,
        password: hashedPassword,
        permissions: mockPermissions,
      });
      mockUserRepository.save.mockResolvedValue({
        id: '1',
        ...createUserDto,
        password: hashedPassword,
        permissions: mockPermissions,
      });

      const result = await service.create(createUserDto);

      expect(result.email).toBe(createUserDto.email);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        email: 'test@example.com',
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', permissions: [] },
        { id: '2', email: 'user2@example.com', permissions: [] },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        relations: ['permissions'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        permissions: [],
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['permissions'],
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      permissions: [],
    };

    it('should update user successfully', async () => {
      const updateDto = { name: 'Updated Name' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      const result = await service.update('1', updateDto);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw ConflictException when updating to existing email', async () => {
      mockUserRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ id: '2', email: 'existing@example.com' });

      await expect(
        service.update('1', { email: 'existing@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      await service.remove('1');

      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });
  });
});
