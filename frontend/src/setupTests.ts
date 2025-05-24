import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';

// Adiciona matchers do jest-axe
expect.extend(toHaveNoViolations);

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup();
}); 