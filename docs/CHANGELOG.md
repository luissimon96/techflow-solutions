# 📝 CHANGELOG

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Unreleased]

### 🔧 Fixed
- **HelmetProvider Missing**: Adicionado `HelmetProvider` em `frontend/src/main.tsx` para corrigir erro `Cannot read properties of undefined (reading 'add')` na página ITServices
- **Contrast Issues**: Melhorado contraste de fontes em banner CTA final (Home.tsx) e rodapé (Footer.tsx) com white color + text-shadow

### ✅ Added
- **Nova Documentação**: Criado diretório `/docs` com documentação centralizada
- **CHANGELOG.md**: Novo arquivo para rastrear mudanças do projeto
- **ARCHITECTURE.md**: Documentação sobre arquitetura e padrões
- **DEPLOYMENT.md**: Guia de deployment para Render e Vercel

### 🗑️ Removed
- **Página Blog** (`/blog`): Removido componente, rota e referencias da navegação
- **Página VacationPlanner** (`/ferias`): Removido componente, rota e referencias da navegação  
- **Página Portfolio** (`/portfolio`): Removido componente, rota e referencias da navegação
- **Admin Link**: Removido link discreto de `/admin/login` do footer
- **API Endpoints**: Removidos endpoints não utilizados de Blog e Portfolio de `frontend/src/lib/api.ts`
- **SEO References**: Removidas rotas de `/blog`, `/ferias` de `sitemap.xml` e `robots.txt`

### 📝 Changed
- **Home.tsx Design**: 
  - Removido banner azul colorido (gradiente brand)
  - Adotado padrão cinza/branco consistente com outras páginas
  - Titulo mudado para usar gradiente com text clip (não branco)
  - Texto descritivo mudado de branco para `gray.600`
  - Botões atualizados para melhor contraste com fundo claro

- **URLs Atualizadas**:
  - Estradeirando: `https://estradeirando.vercel.app/` → `https://www.estradeirando.com.br/`
  - TechFlow Solutions: `https://techflow-solutions.vercel.app/` → `https://www.srluissimon.com/`
  - Links atualizados em pages: About.tsx, Portfolio.tsx

- **Locação do Perfil** (About.tsx):
  - Local: `Carazinho, RS - Brasil` → `Foz do Iguaçu, PR - Brasil`

---

## 📌 Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Versão Atual: 1.0.0

**Data de Lançamento:** 2024

---

## 💡 Como Contribuir

Ao fazer mudanças no projeto:
1. Documente as alterações neste arquivo
2. Use formato consistente (Removed, Added, Changed, Fixed)
3. Agrupe mudanças por tipo e por área (Frontend/Backend)
4. Atualize versão em `package.json` quando aplicável

## Categorias de Mudanças

- **Added**: Novas funcionalidades ou arquivos
- **Changed**: Mudanças em funcionalidades existentes
- **Deprecated**: Funcionalidades que serão removidas em breve
- **Removed**: Funcionalidades ou arquivos removidos
- **Fixed**: Correções de bugs
- **Security**: Correções ou melhorias de segurança
