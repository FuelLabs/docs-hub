import { ThemeProvider } from '@fuel-ui/react';
import { type ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
