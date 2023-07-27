import { ThemeProvider, darkTheme, lightTheme } from '@fuel-ui/react';
import type { ReactNode } from 'react';

type ProviderProps = {
  children: ReactNode;
  theme: string;
};

export function Provider({ children, theme }: ProviderProps) {
  return (
    <ThemeProvider
      themes={{ dark: darkTheme, light: lightTheme }}
      initialTheme={theme}
    >
      {children}
    </ThemeProvider>
  );
}
