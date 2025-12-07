import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Create permissions
    const permissionRepo = dataSource.getRepository(Permission);

    const adminPermission = await permissionRepo.save({
      name: 'admin',
      description: 'Full access to manage users and articles',
    });

    const editorPermission = await permissionRepo.save({
      name: 'editor',
      description: 'Access to manage articles',
    });

    const readerPermission = await permissionRepo.save({
      name: 'reader',
      description: 'Read-only access to articles',
    });

    console.log('✅ Permissions created successfully');

    // Create root user
    const userRepo = dataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('root123456', 10);

    await userRepo.save({
      name: 'Root Admin',
      email: 'root@example.com',
      password: hashedPassword,
      permissions: [adminPermission],
    });

    console.log('✅ Root user created successfully');
    console.log('📧 Email: root@example.com');
    console.log('🔑 Password: root123456');

    // Create sample users
    await userRepo.save({
      name: 'Editor User',
      email: 'editor@example.com',
      password: await bcrypt.hash('editor123456', 10),
      permissions: [editorPermission],
    });

    await userRepo.save({
      name: 'Reader User',
      email: 'reader@example.com',
      password: await bcrypt.hash('reader123456', 10),
      permissions: [readerPermission],
    });

    console.log('✅ Sample users created successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

void seed();
