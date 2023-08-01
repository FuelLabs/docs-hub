import { useFuelTheme } from '@fuel-ui/react';

export default function useTheme() {
  const { current: currentTheme, setTheme } = useFuelTheme();

  return {
    theme: currentTheme,
    setTheme,
  };
}
