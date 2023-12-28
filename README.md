# Energy Bill Server

Este é um projeto Node.js usando Fastify para transformar faturas de luz em PDF, armazenar registros em um banco de dados, e fornecer funcionalidades de pesquisa e geração de gráficos.

## Instalação

Certifique-se de ter o Node.js instalado em sua máquina. Em seguida, execute o seguinte comando para instalar as dependências:

```bash
npm install
```

## Configuração do Banco de Dados

O projeto utiliza o Prisma para interagir com o banco de dados. Execute o seguinte comando para realizar migrações e configurar o banco de dados:

```bash
npm run migrate
```

## Executando o Servidor em Modo de Desenvolvimento

Execute o seguinte comando para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Isso iniciará o servidor usando `tsx watch` para monitorar alterações no código fonte.

## Executando a Verificação de Estilo

Para verificar o estilo do código usando ESLint, execute o seguinte comando:

```bash
npm run lint
```

## Funcionalidades

- Transformação de faturas de luz em PDF.
- Armazenamento de registros no banco de dados.
- Pesquisa de registros.
- Geração de gráficos com base nos dados armazenados.

## Contribuição

Sinta-se à vontade para contribuir para o projeto. Abra uma issue para relatar bugs ou solicitar novas funcionalidades. Se desejar contribuir com código, faça um fork do repositório e abra um pull request.
