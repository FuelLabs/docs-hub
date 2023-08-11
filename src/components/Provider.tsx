import { ThemeProvider, darkTheme, lightTheme } from '@fuel-ui/react';
import { type ReactNode } from 'react';

import useTheme from '../hooks/useTheme';

type ProviderProps = {
  children: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function editTheme(ogTheme: any) {
  const thisTheme = ogTheme;
  if (!thisTheme.components) thisTheme.components = {};
  if (!thisTheme.components.Button) thisTheme.components.Button = {};
  thisTheme.components.Button.defaultProps = {
    intent: 'primary',
  };
  return thisTheme;
}

const newDarkTheme = editTheme(darkTheme);
const newLightTheme = editTheme(lightTheme);

export function Provider({ children }: ProviderProps) {
  const { theme } = useTheme();
  return (
    <ThemeProvider
      themes={{ light: newLightTheme, dark: newDarkTheme }}
      initialTheme={theme}
    >
      {children}
    </ThemeProvider>
  );
}
