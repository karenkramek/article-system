import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PermissionsService } from './permissions/permissions.service';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS if needed
  app.enableCors();

  // Seed permissions and root user
  await seedDatabase(app);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}

async function seedDatabase(app: INestApplication): Promise<void> {
  const permissionsService = app.get(PermissionsService);
  const usersService = app.get(UsersService);

  try {
    // Seed permissions
    console.log('🌱 Seeding permissions...');
    await permissionsService.seedPermissions();
    console.log('✅ Permissions seeded successfully');

    // Check if root user exists
    const rootUser = await usersService.findByEmail('root@example.com');

    if (!rootUser) {
      console.log('🌱 Creating root user...');
      const adminPermission = await permissionsService.findByName('admin');

      if (!adminPermission) {
        throw new Error('Admin permission not found after seeding');
      }

      await usersService.create({
        name: 'Root Admin',
        email: 'root@example.com',
        password: 'root123456',
        permissionIds: [adminPermission.id],
      });

      console.log('✅ Root user created successfully');
      console.log('📧 Email: root@example.com');
      console.log('🔑 Password: root123456');
    } else {
      console.log('ℹ️  Root user already exists');
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error seeding database:', errorMessage);
  }
}

void bootstrap();
