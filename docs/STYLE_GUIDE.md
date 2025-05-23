# Guia de Estilo - TechFlow Solutions

## Princípios Gerais

1. **Simplicidade**: Código simples e direto
2. **Consistência**: Padrões consistentes em todo o projeto
3. **Manutenibilidade**: Código fácil de manter e evoluir
4. **Legibilidade**: Código claro e bem documentado
5. **Performance**: Otimizações quando necessário

## TypeScript

### Tipos

```typescript
// ✅ Correto
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ❌ Evitar
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
}
```

### Enums

```typescript
// ✅ Correto
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// ❌ Evitar
const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;
```

### Funções

```typescript
// ✅ Correto
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}

// ❌ Evitar
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
```

## React

### Componentes

```typescript
// ✅ Correto
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ Evitar
export const Button = (props) => {
  return <button {...props} />;
};
```

### Hooks

```typescript
// ✅ Correto
function useUserData(userId: string) {
  const [data, setData] = useState<UserData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.getUser(userId);
        setData(response);
      } catch (err) {
        setError(err as Error);
      }
    }
    fetchData();
  }, [userId]);

  return { data, error };
}

// ❌ Evitar
function useUserData(userId) {
  const [data, setData] = useState();
  useEffect(() => {
    api.getUser(userId).then(setData);
  }, []);
  return data;
}
```

## Chakra UI

### Componentes

```typescript
// ✅ Correto
<Box
  p={4}
  bg="white"
  borderRadius="md"
  boxShadow="sm"
>
  <Heading size="md" mb={4}>
    Título
  </Heading>
  <Text>Conteúdo</Text>
</Box>

// ❌ Evitar
<div style={{
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
}}>
  <h2 style={{ marginBottom: '16px' }}>Título</h2>
  <p>Conteúdo</p>
</div>
```

### Tema

```typescript
// ✅ Correto
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ...
      900: '#0c4a6e',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
        },
      },
    },
  },
});

// ❌ Evitar
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
  },
};
```

## CSS

### Nomenclatura

```css
/* ✅ Correto */
.user-card {
  /* ... */
}

.user-card__title {
  /* ... */
}

.user-card__content {
  /* ... */
}

/* ❌ Evitar */
.card {
  /* ... */
}

.cardTitle {
  /* ... */
}

.cardContent {
  /* ... */
}
```

### Organização

```css
/* ✅ Correto */
/* Base */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
}

/* Componentes */
.button {
  /* ... */
}

/* Utilitários */
.text-center {
  text-align: center;
}

/* ❌ Evitar */
.button {
  /* ... */
}

:root {
  --color-primary: #007bff;
}

.text-center {
  text-align: center;
}
```

## Testes

### Unitários

```typescript
// ✅ Correto
describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});

// ❌ Evitar
test('button works', () => {
  const button = render(<Button>Click me</Button>);
  expect(button).toBeTruthy();
});
```

### E2E

```typescript
// ✅ Correto
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// ❌ Evitar
it('login', () => {
  cy.visit('/login');
  cy.get('input').first().type('user@example.com');
  cy.get('input').last().type('password123');
  cy.get('button').click();
});
```

## Documentação

### JSDoc

```typescript
// ✅ Correto
/**
 * Calcula o total do carrinho de compras
 * @param items - Lista de itens no carrinho
 * @returns O valor total do carrinho
 * @throws {Error} Se a lista de itens for inválida
 */
function calculateTotal(items: CartItem[]): number {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  return items.reduce((total, item) => total + item.price, 0);
}

// ❌ Evitar
// Calcula o total
function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}
```

### README

```markdown
# Nome do Componente

## Descrição
Breve descrição do componente e seu propósito.

## Props
| Nome | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| title | string | Sim | Título do componente |
| onClick | function | Não | Função chamada ao clicar |

## Exemplo
```tsx
<Component
  title="Título"
  onClick={() => console.log('clicked')}
/>
```

## Notas

- Adicione notas importantes sobre uso
- Documente limitações conhecidas
- Inclua exemplos de casos especiais

```

## Git

### Commits

```

// ✅ Correto
feat(auth): implementa autenticação com JWT

- Adiciona login com email/senha
- Implementa refresh token
- Adiciona middleware de autenticação

// ❌ Evitar
implementa auth

```

### Branches

```

// ✅ Correto
feature/auth
fix/login
docs/readme
chore/deps

// ❌ Evitar
auth
fix
new

```

## Performance

### Imagens

```typescript
// ✅ Correto
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  loading="lazy"
  placeholder="blur"
/>

// ❌ Evitar
<img src="/images/hero.jpg" alt="Hero image" />
```

### Code Splitting

```typescript
// ✅ Correto
const Dashboard = lazy(() => import('./pages/Dashboard'));

// ❌ Evitar
import Dashboard from './pages/Dashboard';
```

## Acessibilidade

```typescript
// ✅ Correto
<button
  aria-label="Fechar modal"
  onClick={onClose}
>
  <Icon name="close" />
</button>

// ❌ Evitar
<button onClick={onClose}>
  <Icon name="close" />
</button>
```

## Internacionalização

```typescript
// ✅ Correto
const messages = {
  pt: {
    welcome: 'Bem-vindo',
    login: 'Entrar',
  },
  en: {
    welcome: 'Welcome',
    login: 'Login',
  },
};

// ❌ Evitar
const messages = {
  welcome: 'Bem-vindo',
  login: 'Entrar',
};
```
