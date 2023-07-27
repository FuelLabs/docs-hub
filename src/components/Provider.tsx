import { ThemeProvider, darkTheme, lightTheme } from '@fuel-ui/react';
import type { ReactNode } from 'react';

import useTheme from '../hooks/useTheme';

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  const { theme } = useTheme();
  return (
    <ThemeProvider
      themes={{ dark: darkTheme, light: lightTheme }}
      initialTheme={theme}
    >
      {children}
    </ThemeProvider>
  );
}
