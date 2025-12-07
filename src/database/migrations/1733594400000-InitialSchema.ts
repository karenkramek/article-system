import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitialSchema1733594400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de permissões
    await queryRunner.createTable(
      new Table({
        name: 'permission',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Criar tabela de usuários
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Criar tabela de relacionamento user-permissions (muitos-para-muitos)
    await queryRunner.createTable(
      new Table({
        name: 'user_permissions_permission',
        columns: [
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'permissionId',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Criar foreign keys para a tabela de relacionamento
    await queryRunner.createForeignKey(
      'user_permissions_permission',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_permissions_permission',
      new TableForeignKey({
        columnNames: ['permissionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permission',
        onDelete: 'CASCADE',
      }),
    );

    // Criar tabela de artigos
    await queryRunner.createTable(
      new Table({
        name: 'article',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'authorId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Criar foreign key de article para user (autor)
    await queryRunner.createForeignKey(
      'article',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    // Inserir permissões padrão
    await queryRunner.query(`
      INSERT INTO permission (name, description) VALUES
        ('admin', 'Full access to manage users and articles'),
        ('editor', 'Access to manage articles'),
        ('reader', 'Read-only access to articles')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign keys
    const articleTable = await queryRunner.getTable('article');
    const articleForeignKey = articleTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('authorId') !== -1,
    );
    if (articleForeignKey) {
      await queryRunner.dropForeignKey('article', articleForeignKey);
    }

    const userPermissionsTable = await queryRunner.getTable(
      'user_permissions_permission',
    );
    const userPermissionsForeignKeys = userPermissionsTable?.foreignKeys || [];
    for (const fk of userPermissionsForeignKeys) {
      await queryRunner.dropForeignKey('user_permissions_permission', fk);
    }

    // Remover tabelas
    await queryRunner.dropTable('article');
    await queryRunner.dropTable('user_permissions_permission');
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('permission');
  }
}
