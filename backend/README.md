# TechFlow API

Backend da aplicação TechFlow Solutions, desenvolvido com Node.js, Express e TypeScript com integração WhatsApp.

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- WhatsApp API Integration
- Jest
- ESLint
- Prettier

## Requisitos

- Node.js 18 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Copie o arquivo de exemplo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

4. Configure as variáveis de ambiente no arquivo `.env`

## Scripts Disponíveis

- `npm start`: Inicia o servidor em modo de produção
- `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build`: Compila o código TypeScript
- `npm test`: Executa os testes
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código com Prettier

## Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente de execução (development, test, production)
- `JWT_SECRET`: Chave secreta para geração de tokens JWT
- `CORS_ORIGIN`: Origem permitida para requisições CORS

## Estrutura do Projeto

```
src/
  ├── config/         # Configurações da aplicação
  ├── middleware/     # Middlewares
  ├── controllers/    # Controllers da API
  ├── routes/         # Rotas da API
  ├── services/       # Serviços
  ├── types/          # Definições de tipos
  ├── utils/          # Utilitários
  └── index.ts        # Ponto de entrada da aplicação
```

## Testes

Os testes são escritos com Jest e podem ser executados com:

```bash
npm test
```

## Linting e Formatação

O código é verificado com ESLint e formatado com Prettier. Para executar:

```bash
npm run lint
npm run format
```

## Deploy

O projeto está configurado para deploy no Render.com. O arquivo `render.yaml` contém as configurações necessárias.

## Licença

MIT
