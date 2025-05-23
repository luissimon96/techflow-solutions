# Guia de Contribuição - TechFlow Solutions

## Introdução

Obrigado por considerar contribuir com o projeto TechFlow Solutions! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## Como Contribuir

### 1. Configuração do Ambiente

1. Faça um fork do repositório
2. Clone o fork localmente:

   ```bash
   git clone https://github.com/seu-usuario/techflow-solutions.git
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

### 2. Fluxo de Trabalho

1. Crie uma branch para sua feature:

   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Faça suas alterações seguindo os padrões do projeto

3. Execute os testes:

   ```bash
   npm test
   ```

4. Faça commit das alterações:

   ```bash
   git commit -m "feat: descrição da feature"
   ```

5. Envie para seu fork:

   ```bash
   git push origin feature/nome-da-feature
   ```

6. Abra um Pull Request

### 3. Padrões de Código

#### TypeScript

- Use tipos explícitos
- Evite `any`
- Documente interfaces e tipos complexos
- Use enums para valores constantes

#### React

- Use componentes funcionais
- Implemente hooks personalizados para lógica reutilizável
- Mantenha componentes pequenos e focados
- Use memoização quando necessário

#### Estilização

- Use Chakra UI para componentes base
- Siga o sistema de design
- Mantenha consistência visual
- Documente variações de componentes

### 4. Commits

Siga o padrão Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Tipos:

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

### 5. Pull Requests

1. Atualize sua branch com a main
2. Resolva conflitos
3. Mantenha o PR focado em uma única feature
4. Inclua testes
5. Atualize documentação
6. Descreva as mudanças

### 6. Testes

#### Unitários

- Use Jest e React Testing Library
- Teste comportamentos, não implementações
- Mantenha cobertura acima de 80%

#### E2E

- Use Cypress
- Teste fluxos críticos
- Mantenha testes independentes

### 7. Documentação

- Atualize README quando necessário
- Documente APIs e componentes
- Inclua exemplos de uso
- Mantenha documentação em português

### 8. Code Review

#### Como Revisar

- Verifique funcionalidade
- Avalie qualidade do código
- Confirme testes
- Verifique documentação

#### Como Ser Revisado

- Responda feedback
- Faça alterações sugeridas
- Mantenha discussão construtiva

### 9. Ambiente de Desenvolvimento

#### VS Code

- Instale extensões recomendadas
- Use configurações do projeto
- Ative format on save

#### Git

- Configure git hooks
- Use .gitignore
- Mantenha histórico limpo

### 10. Suporte

- Use issues para bugs
- Use discussions para ideias
- Mantenha comunicação profissional
- Respeite o código de conduta

## Código de Conduta

1. Seja respeitoso
2. Mantenha comunicação profissional
3. Aceite feedback construtivo
4. Ajude outros contribuidores
5. Reporte comportamentos inadequados

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.
