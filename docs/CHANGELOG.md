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
- **Pré-preenchimento de Orçamento em ITServices**: Adicionada função `handleQuoteRequest` para preencher automaticamente campos do formulário de orçamento quando clicado em serviços de TI (mesmo padrão de Services.tsx)
- **Logo Favicon na Página Sobre**: Substituído ícone genérico por favicon oficial da TechFlow Solutions

### 🗑️ Removed

#### Páginas Orphaned (Remoção Completa - v2.0.0 Cleanup)
- **Página Blog.tsx**: Arquivo de página removido
- **Página Portfolio.tsx**: Arquivo de página removido
- **Página VacationPlanner.tsx**: Arquivo de página removido
- **Página Clients.tsx**: Arquivo antigo removido (duplicação de Clients/index.tsx)
- **Diretório Clients/**: Pasta com versão alternativa de página removida (incluindo index.tsx)

#### Componentes Orphaned (Remoção Completa - v2.0.0 Cleanup)
- **Componente VacationPlanner**: Pasta completa removida (`components/VacationPlanner/`)
  - Calculator.tsx (calculadora de férias)
  - CalendarView.tsx (visualizador de calendário)
  - ExportPanel.tsx (painel de exportação)
  - SuggestionsList.tsx (lista de sugestões)
  - index.ts (re-exports)

#### Hooks Orphaned (Remoção Completa - v2.0.0 Cleanup)
- **Hook useVacationCalculator.ts**: Hook personalizado removido (lógica de cálculo de férias)

#### Tipos Orphaned (Remoção Completa - v2.0.0 Cleanup)
- **Tipo vacation.ts**: Arquivo de tipos removido (interfaces VacationOptions, Holiday, WorkingDays, SearchPeriod, LocationInfo, Suggestion - associados ao sistema removido)

#### Testes Orphaned (Remoção Completa - v2.0.0 Cleanup)
- **VacationPlanner.test.tsx**: Arquivo de teste removido

#### Anteriormente Removidos
- **Página Blog** (`/blog`): Removido componente, rota e referencias da navegação
- **Página VacationPlanner** (`/ferias`): Removido componente, rota e referencias da navegação  
- **Página Portfolio** (`/portfolio`): Removido componente, rota e referencias da navegação
- **Página Clientes** (`/clientes`): Removido componente, rota e referencias da navegação
- **Admin Link**: Removido link discreto de `/admin/login` do footer
- **Botão "Ver Projetos"**: Removido botão de CTA em Home.tsx que redirecionava para `/clientes`
- **API Endpoints**: Removidos endpoints não utilizados de Blog e Portfolio de `frontend/src/lib/api.ts`
- **SEO References**: Removidas rotas de `/blog`, `/ferias` de `sitemap.xml` e `robots.txt`

### 📝 Changed
- **Página About Refatorada**: 
  - Transformada de página de perfil pessoal para página corporativa da TechFlow Solutions
  - Adicionadas seções: Missão, Visão, Valores (Inovação, Excelência, Confiabilidade, Transparência)
  - Reordenados serviços com Manutenção de TI em destaque
  - Atualizado conteúdo para foco em soluções tecnológicas para empresas
  - Localização: Foz do Iguaçu, Paraná - Brasil
  - Estatísticas: 150+ clientes, 250+ projetos, 10+ anos de experiência

- **Página Contact Refatorada e Reposicionada na Navegação**:
  - Adotado padrão visual consistente com About.tsx (gradiente em seção, MotionBox animations)
  - Estrutura: Heading com gradiente de texto + subtítulo descritivo
  - Espaçamento responsivo: `spacing={{ base: 12, md: 16, lg: 20 }}`
  - Fundo: Gradiente `linear(to-br, gray.50, white, gray.50)`
  - Cards aprimorados com `border="1px solid"` e sombra melhorada
  - Informações de contato reorganizadas em cards com ícones + labels
  - Botão WhatsApp com `colorScheme="whatsapp"` e animação hover
  - Inputs com focus states estilizados: `borderColor='brand.500'` + drop shadow
  - **Navegação atualizada**: Contato agora aparece após "Sobre" (ordem: Serviços de TI → Desenvolvimento → Sobre → Contato)
  - Localização na empresa corrigida: `Carazinho, RS` → `Foz do Iguaçu, Paraná - Brasil`

- **Ordem de Navegação (Atualizada)**:
  - Antes: Desenvolvimento → Serviços de TI → Sobre
  - Depois: **Serviços de TI → Desenvolvimento → Sobre → Contato**
  - Mudança aplicada em `frontend/src/components/Header.tsx`

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
