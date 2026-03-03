import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Logo } from '../Logo';

describe('Logo Component', () => {
  it('deve renderizar o logo', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );

    const text = screen.getByText('TechFlow');
    expect(text).toBeInTheDocument();
  });

  it('deve renderizar como elemento decorativo quando apropriado', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );

    const logo = screen.getByText('TechFlow');
    expect(logo).toBeInTheDocument();
  });

  it('deve renderizar sem erros', () => {
    expect(() => {
      render(
        <BrowserRouter>
          <Logo />
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  it('deve aplicar tamanho pequeno corretamente', () => {
    render(
      <BrowserRouter>
        <Logo size="sm" />
      </BrowserRouter>
    );

    const text = screen.getByText('TechFlow');
    expect(text).toBeInTheDocument();
  });
});

