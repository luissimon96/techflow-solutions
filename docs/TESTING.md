# Guia de Testes - TechFlow Solutions

## Princípios de Testes

1. **Cobertura**: Testar todos os caminhos possíveis
2. **Isolamento**: Testes independentes e isolados
3. **Reprodutibilidade**: Testes consistentes e repetíveis
4. **Manutenibilidade**: Testes fáceis de manter
5. **Legibilidade**: Testes claros e bem documentados

## Tipos de Testes

### Unitários

```typescript
// ✅ Correto
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('deve renderizar com o texto correto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Clique aqui</Button>);
    fireEvent.click(screen.getByText('Clique aqui'));
    expect(onClick).toHaveBeenCalled();
  });

  it('deve estar desabilitado quando disabled', () => {
    render(<Button disabled>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeDisabled();
  });
});

// ❌ Evitar
test('button works', () => {
  const button = render(<Button>Clique aqui</Button>);
  expect(button).toBeTruthy();
});
```

### Integração

```typescript
// ✅ Correto
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { AuthProvider } from './AuthContext';

describe('LoginForm', () => {
  it('deve fazer login com sucesso', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Bem-vindo')).toBeInTheDocument();
    });
  });

  it('deve mostrar erro com credenciais inválidas', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@example.com' }
    });

    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'wrongpass' }
    });

    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });
});

// ❌ Evitar
test('login form', async () => {
  render(<LoginForm />);
  // Testes incompletos e sem assertions
});
```

### E2E

```typescript
// ✅ Correto
describe('Fluxo de Compra', () => {
  it('deve completar uma compra com sucesso', () => {
    cy.visit('/produtos');
    
    // Adiciona produto ao carrinho
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // Vai para o carrinho
    cy.get('[data-testid="cart-icon"]').click();
    
    // Finaliza compra
    cy.get('[data-testid="checkout"]').click();
    
    // Preenche formulário
    cy.get('[data-testid="name"]').type('João Silva');
    cy.get('[data-testid="email"]').type('joao@example.com');
    cy.get('[data-testid="address"]').type('Rua Exemplo, 123');
    
    // Confirma compra
    cy.get('[data-testid="confirm-purchase"]').click();
    
    // Verifica sucesso
    cy.url().should('include', '/sucesso');
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});

// ❌ Evitar
it('buy product', () => {
  cy.visit('/');
  cy.get('button').click();
  cy.get('input').type('test');
});
```

### Snapshot

```typescript
// ✅ Correto
import { render } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('deve manter o mesmo snapshot', () => {
    const { container } = render(
      <ProductCard
        title="Produto Teste"
        price={99.99}
        image="/test.jpg"
      />
    );
    expect(container).toMatchSnapshot();
  });
});

// ❌ Evitar
test('snapshot', () => {
  const component = render(<ProductCard />);
  expect(component).toMatchSnapshot();
});
```

## Mocks e Stubs

### API

```typescript
// ✅ Correto
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Produto 1' },
        { id: 2, name: 'Produto 2' }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ❌ Evitar
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] })
  })
);
```

### Context

```typescript
// ✅ Correto
import { render } from '@testing-library/react';
import { AuthContext } from './AuthContext';

const mockAuthContext = {
  user: { id: 1, name: 'Test User' },
  login: jest.fn(),
  logout: jest.fn()
};

function renderWithAuth(ui) {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      {ui}
    </AuthContext.Provider>
  );
}

// ❌ Evitar
jest.mock('./AuthContext', () => ({
  useAuth: () => ({ user: null })
}));
```

## Cobertura

### Configuração

```typescript
// ✅ Correto
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

// ❌ Evitar
// Sem configuração de cobertura
```

### Relatórios

```typescript
// ✅ Correto
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}

// ❌ Evitar
{
  "scripts": {
    "test": "jest"
  }
}
```

## Performance

### Testes de Performance

```typescript
// ✅ Correto
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';

describe('Performance', () => {
  it('deve renderizar em menos de 100ms', () => {
    const start = performance.now();
    
    render(<ComplexComponent />);
    
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
});

// ❌ Evitar
// Sem testes de performance
```

### Memória

```typescript
// ✅ Correto
import { render } from '@testing-library/react';

describe('Memory Leaks', () => {
  it('não deve ter memory leaks', () => {
    const { unmount } = render(<Component />);
    
    // Simula uso
    for (let i = 0; i < 1000; i++) {
      // Ações que podem causar leaks
    }
    
    unmount();
    
    // Verifica se há leaks
    expect(global.gc).toBeDefined();
  });
});

// ❌ Evitar
// Sem testes de memória
```

## Acessibilidade

```typescript
// ✅ Correto
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Acessibilidade', () => {
  it('deve passar nos testes de acessibilidade', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ❌ Evitar
// Sem testes de acessibilidade
```

## CI/CD

### Pipeline

```yaml
# ✅ Correto
# .github/workflows/test.yml
name: Testes

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Upload coverage
      uses: codecov/codecov-action@v2
      
    - name: Run E2E tests
      run: npm run test:e2e

# ❌ Evitar
# Sem pipeline de testes
```

## Checklist de Testes

### Unitários

- [ ] Componentes React
- [ ] Hooks personalizados
- [ ] Funções utilitárias
- [ ] Reducers e actions
- [ ] Selectors

### Integração

- [ ] Fluxos de autenticação
- [ ] Formulários
- [ ] Navegação
- [ ] Estado global
- [ ] APIs

### E2E

- [ ] Fluxos críticos
- [ ] Responsividade
- [ ] Performance
- [ ] Acessibilidade
- [ ] Cross-browser

### Qualidade

- [ ] Cobertura de código
- [ ] Linting
- [ ] Type checking
- [ ] Performance
- [ ] Acessibilidade
