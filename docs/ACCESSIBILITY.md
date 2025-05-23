# Guia de Acessibilidade - TechFlow Solutions

## Princípios de Acessibilidade

1. **Perceptível**: Informações e interface devem ser apresentáveis
2. **Operável**: Interface deve ser navegável e utilizável
3. **Compreensível**: Informações e operações devem ser compreensíveis
4. **Robusto**: Conteúdo deve ser interpretável por tecnologias assistivas

## WCAG 2.1

### Níveis de Conformidade

- **A**: Requisitos básicos
- **AA**: Requisitos intermediários
- **AAA**: Requisitos avançados

## Implementação

### HTML Semântico

```typescript
// ✅ Correto
function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/sobre">Sobre</a></li>
          <li><a href="/contato">Contato</a></li>
        </ul>
      </nav>
    </header>
  );
}

// ❌ Evitar
function Header() {
  return (
    <div>
      <div>
        <div>Home</div>
        <div>Sobre</div>
        <div>Contato</div>
      </div>
    </div>
  );
}
```

### ARIA

```typescript
// ✅ Correto
function Modal({ isOpen, onClose, children }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Título do Modal</h2>
      <button
        aria-label="Fechar modal"
        onClick={onClose}
      >
        <Icon name="close" />
      </button>
      {children}
    </div>
  );
}

// ❌ Evitar
function Modal({ isOpen, onClose, children }) {
  return (
    <div>
      <h2>Título do Modal</h2>
      <button onClick={onClose}>
        <Icon name="close" />
      </button>
      {children}
    </div>
  );
}
```

### Formulários

```typescript
// ✅ Correto
function LoginForm() {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby="email-error"
        />
        {errors.email && (
          <span id="email-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>
      
      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          aria-required="true"
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby="password-error"
        />
        {errors.password && (
          <span id="password-error" role="alert">
            {errors.password}
          </span>
        )}
      </div>
      
      <button type="submit">Entrar</button>
    </form>
  );
}

// ❌ Evitar
function LoginForm() {
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Senha" />
      <button>Entrar</button>
    </form>
  );
}
```

### Navegação

```typescript
// ✅ Correto
function Navigation() {
  return (
    <nav aria-label="Menu principal">
      <ul>
        <li>
          <a href="/" aria-current={location.pathname === '/' ? 'page' : undefined}>
            Home
          </a>
        </li>
        <li>
          <a href="/produtos" aria-current={location.pathname === '/produtos' ? 'page' : undefined}>
            Produtos
          </a>
        </li>
      </ul>
    </nav>
  );
}

// ❌ Evitar
function Navigation() {
  return (
    <div>
      <a href="/">Home</a>
      <a href="/produtos">Produtos</a>
    </div>
  );
}
```

### Imagens

```typescript
// ✅ Correto
function ProductImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      width={800}
      height={600}
    />
  );
}

// Para imagens decorativas
function DecorativeImage() {
  return (
    <img
      src="/decorative.jpg"
      alt=""
      role="presentation"
    />
  );
}

// ❌ Evitar
function ProductImage({ src }) {
  return <img src={src} />;
}
```

### Cores

```typescript
// ✅ Correto
const theme = {
  colors: {
    text: {
      primary: '#000000',
      secondary: '#666666',
      error: '#D32F2F'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5'
    }
  }
};

// Verificação de contraste
function checkContrast(foreground, background) {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA
}

// ❌ Evitar
const theme = {
  colors: {
    text: '#000',
    background: '#fff'
  }
};
```

### Teclado

```typescript
// ✅ Correto
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  return (
    <div onKeyDown={handleKeyDown}>
      <button
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
      
      {isOpen && (
        <ul
          id="dropdown-menu"
          role="menu"
        >
          <li role="none">
            <a
              href="/item1"
              role="menuitem"
              tabIndex={0}
            >
              Item 1
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

// ❌ Evitar
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      {isOpen && (
        <ul>
          <li><a href="/item1">Item 1</a></li>
        </ul>
      )}
    </div>
  );
}
```

### Animações

```typescript
// ✅ Correto
// styles.css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

// Componente
function AnimatedComponent() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  return (
    <div
      style={{
        animation: prefersReducedMotion ? 'none' : 'fadeIn 0.5s'
      }}
    >
      Conteúdo
    </div>
  );
}

// ❌ Evitar
function AnimatedComponent() {
  return (
    <div style={{ animation: 'fadeIn 0.5s' }}>
      Conteúdo
    </div>
  );
}
```

### Testes

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

## Checklist de Acessibilidade

### Estrutura

- [ ] HTML semântico
- [ ] Headings hierárquicos
- [ ] Landmarks ARIA
- [ ] Roles apropriados
- [ ] Labels e descrições

### Navegação

- [ ] Foco visível
- [ ] Ordem de tabulação
- [ ] Skip links
- [ ] Breadcrumbs
- [ ] Sitemap

### Formulários

- [ ] Labels associados
- [ ] Mensagens de erro
- [ ] Validação
- [ ] Autocomplete
- [ ] Grupos de campos

### Mídia

- [ ] Alt text
- [ ] Legendas
- [ ] Transcrições
- [ ] Contraste
- [ ] Tamanho de texto

### Interatividade

- [ ] Teclado
- [ ] Touch targets
- [ ] Gestos alternativos
- [ ] Timeouts
- [ ] Animações

### Responsividade

- [ ] Viewport
- [ ] Zoom
- [ ] Reflow
- [ ] Touch
- [ ] Orientação

### Tecnologias Assistivas

- [ ] Screen readers
- [ ] Voice control
- [ ] Switch devices
- [ ] Magnifiers
- [ ] Braille displays
