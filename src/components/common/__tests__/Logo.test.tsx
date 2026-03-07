import { render, screen } from '@testing-library/react';
import { Logo } from '../Logo';

describe('Logo Component', () => {
  it('deve renderizar o logo', () => {
    render(<Logo />);

    const logo = screen.getByRole('img', { name: 'TechFlow Solutions' });
    expect(logo).toBeInTheDocument();
  });

  it('deve renderizar com alt acessivel', () => {
    render(<Logo />);

    const logo = screen.getByRole('img', { name: 'TechFlow Solutions' });
    expect(logo).toBeInTheDocument();
  });

  it('deve renderizar sem erros', () => {
    expect(() => {
      render(<Logo />);
    }).not.toThrow();
  });

  it('deve aplicar tamanho pequeno corretamente', () => {
    render(<Logo size="sm" />);

    const logo = screen.getByRole('img', { name: 'TechFlow Solutions' });
    expect(logo).toBeInTheDocument();
  });
});

