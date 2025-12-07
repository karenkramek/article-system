import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    return this.permissionsRepository.find({
      where: { id: In(ids) },
    });
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionsRepository.findOne({ where: { name } });
  }

  async seedPermissions(): Promise<void> {
    const permissions = [
      {
        name: 'admin',
        description: 'Full access to manage users and articles',
      },
      { name: 'editor', description: 'Access to manage articles' },
      { name: 'reader', description: 'Read-only access to articles' },
    ];

    for (const permData of permissions) {
      const exists = await this.findByName(permData.name);
      if (!exists) {
        await this.permissionsRepository.save(permData);
      }
    }
  }
}
