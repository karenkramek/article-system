# Teste Sistema Simples de Artigos

## Enunciado

O sistema permite o cadastro de usuários e artigos. Os usuários devem estar autenticados
para executar ações no sistema.

### Autenticação e Autorização:
Implemente uma rota para o login.
Utilize autenticação baseada em token JWT, incluindo o nível de permissão do usuário no
token.

### Gerenciamento de Usuários:
Implemente rotas para cadastro, edição e exclusão e leitura de usuários.
Usuários devem conter nome, senha e email.

### Gerenciamento de Artigos:
Implemente rotas para criação, edição, exclusão e leitura de artigos.
Artigos devem conter título, conteúdo e a informação de quem o criou.

### Permissões:
Implemente uma tabela para as permissões com os campos nome e descrição.
As permissões, assim como o usuário root, devem ser criadas via migration e seed no
momento da subida do projeto.

### Níveis de Permissão
- **Admin**:
Permissão para administrar artigos e usuários.
**Ações**: Ler, Criar, Editar e Apagar artigos e usuários.
- **Editor**:
Permissão para administrar artigos.
**Ações**: Ler, Criar, Editar e Apagar artigos.
- **Reader**:
Permissão para apenas ler artigos.
**Ações**: Ler artigos.

## Requisitos Técnicos
1. Utilize o framework NestJS.
2. Crie um ```docker-compose``` com todos os serviços necessários para o funcionamento de sua
aplicação.
2.1. O comando ```docker compose up --build``` deve ser capaz de subir todo o projeto e deixá-lo
disponível na porta 3000.
3. Utilize a semântica correta dos endpoints REST.
4. A aplicação deve ser headless, ou seja, não deve ter uma interface gráfica.

## Considerações
**Será avaliado:**
- Implementação correta da lógica de negócios.
- Estrutura e organização do código (deve saber argumentar as escolhas).
- Funcionalidades implementadas de acordo com os requisitos.
- Uso apropriado de tecnologias e boas práticas de desenvolvimento de backend.
- Desempenho e eficiência do código.

*O código deve ser entregue em um repositório GitHub.*