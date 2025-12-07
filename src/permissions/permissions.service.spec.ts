import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';

describe('PermissionsService', () => {
  let service: PermissionsService;

  const mockPermissionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const mockPermissions = [
        { id: '1', name: 'admin', description: 'Admin permission' },
        { id: '2', name: 'editor', description: 'Editor permission' },
      ];

      mockPermissionRepository.find.mockResolvedValue(mockPermissions);

      const result = await service.findAll();

      expect(result).toEqual(mockPermissions);
      expect(mockPermissionRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByName', () => {
    it('should return a permission by name', async () => {
      const mockPermission = {
        id: '1',
        name: 'admin',
        description: 'Admin permission',
      };

      mockPermissionRepository.findOne.mockResolvedValue(mockPermission);

      const result = await service.findByName('admin');

      expect(result).toEqual(mockPermission);
      expect(mockPermissionRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'admin' },
      });
    });

    it('should return null when permission not found', async () => {
      mockPermissionRepository.findOne.mockResolvedValue(null);

      const result = await service.findByName('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('seedPermissions', () => {
    it('should create permissions when they do not exist', async () => {
      mockPermissionRepository.findOne.mockResolvedValue(null);
      mockPermissionRepository.save.mockImplementation((perm) =>
        Promise.resolve({ id: '1', ...perm }),
      );

      await service.seedPermissions();

      expect(mockPermissionRepository.save).toHaveBeenCalledTimes(3);
      expect(mockPermissionRepository.save).toHaveBeenCalledWith({
        name: 'admin',
        description: 'Full access to manage users and articles',
      });
    });

    it('should not create permissions when they already exist', async () => {
      mockPermissionRepository.findOne.mockResolvedValue({
        id: '1',
        name: 'admin',
      });

      await service.seedPermissions();

      expect(mockPermissionRepository.save).not.toHaveBeenCalled();
    });
  });
});
