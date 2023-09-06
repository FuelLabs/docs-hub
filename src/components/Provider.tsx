import {
  ThemeProvider,
  darkTheme,
  lightTheme,
  loadIcons,
  setFuelThemes,
} from '@fuel-ui/react';
import { type ReactNode } from 'react';

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

loadIcons('/icons/sprite.svg');
setFuelThemes({
  themes: {
    dark: editTheme(darkTheme),
    light: editTheme(lightTheme),
  },
});

export function Provider({ children }: ProviderProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
