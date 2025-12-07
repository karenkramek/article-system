# Sistema de Artigos

Sistema simples de gerenciamento de artigos e usuários com autenticação JWT e controle de permissões baseado em roles (Admin, Editor, Reader).

> 📋 Criado a partir do enunciado do [desafio técnico](./Challenge.md).

## 📋 Descrição

API RESTful headless desenvolvida com NestJS, PostgreSQL e TypeORM que permite:

- 🔐 Autenticação via JWT com permissões incluídas no token
- 👥 Gerenciamento de usuários (CRUD completo)
- 📝 Gerenciamento de artigos (CRUD completo)
- 🎯 Sistema de permissões com 3 níveis de acesso
- 🗑️ Soft delete em todas as entidades
- 🐳 Ambiente completo via Docker

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript
- **JWT** - Autenticação via tokens
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de DTOs
- **Docker & Docker Compose** - Containerização

## 🎭 Níveis de Permissão

| Permissão | Descrição | Ações |
|-----------|-----------|-------|
| **Admin** | Acesso total ao sistema | CRUD de usuários e artigos |
| **Editor** | Gerenciamento de artigos | CRUD de artigos |
| **Reader** | Leitura de artigos | Visualizar artigos |

## 📦 Instalação e Execução (Docker)

### Pré-requisitos

- Docker instalado ([Docker Desktop](https://www.docker.com/products/docker-desktop) ou [Colima](https://github.com/abiosoft/colima) para macOS)
- Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/karenkramek/article-system.git
cd article-system
```

### 2. Configure as variáveis de ambiente

O arquivo `.env.example` contém as variáveis necessárias. Copie e ajuste conforme necessário:

```bash
cp .env.example .env
```

Variáveis principais:
```env
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
JWT_SECRET=
PORT=
```

### 3. Suba a aplicação

```bash
docker compose up --build
```

A aplicação estará disponível em: **http://localhost:3000**

### 4. Parar a aplicação

```bash
# Parar containers
docker compose down

# Parar e remover volumes (apaga dados do banco)
docker compose down -v
```

## 🗄️ Migrations (Desenvolvimento Local)

O projeto suporta migrations do TypeORM para controle de versão do schema do banco de dados.

### Comandos disponíveis:

```bash
# Gerar migration automaticamente baseada nas mudanças das entities
npm run migration:generate -- src/database/migrations/MigrationName

# Criar migration vazia manualmente
npm run migration:create -- src/database/migrations/MigrationName

# Executar migrations pendentes
npm run migration:run

# Reverter última migration executada
npm run migration:revert
```

### Exemplo de uso:

```bash
# 1. Após modificar uma entity, gere a migration
npm run migration:generate -- src/database/migrations/AddEmailVerification

# 2. Execute a migration
npm run migration:run
```

**Nota:** No ambiente Docker, o projeto usa `synchronize: true` para desenvolvimento. Em produção, o synchronize deve ser desabilitado e usar somente migrations.

## 🧪 Como Testar

### Usuário Root (criado automaticamente)

Ao subir a aplicação, um usuário administrador é criado automaticamente:

- **Email**: `root@example.com`
- **Senha**: `root123456`
- **Permissão**: Admin

### 1. Login (obter JWT)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "root@example.com",
    "password": "root123456"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Root Admin",
    "email": "root@example.com",
    "permissions": [{"name": "admin", ...}]
  }
}
```

Salve o `access_token` para usar nas próximas requisições.

### 2. Criar um novo usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 3. Criar um artigo (requer autenticação)

```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Meu Primeiro Artigo",
    "content": "Este é o conteúdo do meu artigo de teste."
  }'
```

### 4. Listar artigos

```bash
curl http://localhost:3000/articles \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5. Buscar artigo por ID

```bash
curl http://localhost:3000/articles/UUID_DO_ARTIGO \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 6. Atualizar artigo

```bash
curl -X PATCH http://localhost:3000/articles/UUID_DO_ARTIGO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Título Atualizado"
  }'
```

### 7. Deletar artigo (soft delete)

```bash
curl -X DELETE http://localhost:3000/articles/UUID_DO_ARTIGO \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📚 Endpoints Disponíveis

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/login` | Login e geração de JWT | Não |

### Usuários

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| POST | `/users` | Criar usuário | Pública |
| GET | `/users` | Listar usuários | Admin |
| GET | `/users/:id` | Buscar usuário por ID | Admin |
| PATCH | `/users/:id` | Atualizar usuário | Admin |
| DELETE | `/users/:id` | Deletar usuário | Admin |

### Artigos

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| POST | `/articles` | Criar artigo | Admin, Editor |
| GET | `/articles` | Listar artigos | Admin, Editor, Reader |
| GET | `/articles/:id` | Buscar artigo por ID | Admin, Editor, Reader |
| PATCH | `/articles/:id` | Atualizar artigo | Admin, Editor (autor) |
| DELETE | `/articles/:id` | Deletar artigo | Admin, Editor (autor) |

## 🧩 Estrutura do Projeto

```
src/
├── articles/          # Módulo de artigos
│   ├── dto/          # Data Transfer Objects
│   ├── entities/     # Entidade Article
│   ├── articles.controller.ts
│   ├── articles.service.ts
│   └── articles.module.ts
├── auth/             # Módulo de autenticação
│   ├── decorators/   # Custom decorators
│   ├── dto/          # DTOs de login
│   ├── guards/       # JWT e Permission guards
│   ├── strategies/   # Passport JWT strategy
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── permissions/      # Módulo de permissões
│   ├── entities/     # Entidade Permission
│   ├── permissions.service.ts
│   └── permissions.module.ts
├── users/            # Módulo de usuários
│   ├── dto/          # DTOs de usuário
│   ├── entities/     # Entidade User
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── database/
│   └── seeds/        # Seeds do banco
├── app.module.ts     # Módulo principal
└── main.ts           # Entry point
```

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (salt rounds: 10)
- ✅ JWT com expiração configurável
- ✅ Guards para autenticação e autorização
- ✅ Validação de entrada com class-validator
- ✅ Senha excluída da serialização de usuários
- ✅ CORS habilitado

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
npm run test

# Modo watch (desenvolvimento)
npm run test:watch

# Coverage completo
npm run test:cov
```

### Testes Implementados

Os testes unitários cobrem as seguintes áreas essenciais:

#### ✅ PermissionsService
- Listagem de permissões
- Busca por nome
- Seed automático de permissões

#### ✅ AuthService
- Login com credenciais válidas
- Validação de usuário e senha
- Geração de JWT
- Tratamento de credenciais inválidas

#### ✅ UsersService
- Criação de usuários
- Validação de email duplicado
- Atualização de dados
- Remoção de usuários
- Hash de senhas

#### ✅ ArticlesService
- Criação de artigos
- Listagem e busca
- Atualização com controle de permissões
- Remoção com validação de autor/admin
- Regras de negócio de permissões

### Cobertura de Testes

Os testes cobrem:
- ✅ Casos de sucesso
- ✅ Validações de erro (NotFoundException, ConflictException, ForbiddenException)
- ✅ Regras de permissão (Admin, Editor, Reader)
- ✅ Autenticação e autorização
- ✅ Hash de senhas
- ✅ Validação de dados

**Cobertura atual dos Services:**
- AuthService: ~100% (login, validação)
- UsersService: ~90% (CRUD, validações)
- ArticlesService: ~100% (CRUD, permissões)
- PermissionsService: ~94% (listagem, seed)

### Executar Testes no Docker

```bash
# Subir container apenas para testes
docker compose run --rm app npm run test

# Coverage no Docker
docker compose run --rm app npm run test:cov
```
