import { cssObj } from '@fuel-ui/css';
import { Box, Icon, useFuelTheme } from '@fuel-ui/react';

import useTheme from '../hooks/useTheme';

export function ThemeToggler() {
  const { setTheme } = useFuelTheme();
  const { theme: current, setTheme: setThemeContext } = useTheme();

  const handleChange = async () => {
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    await setThemeContext(next);
  };

  return (
    <Box css={styles.root} data-theme={current} onClick={handleChange}>
      <Icon icon="SunFilled" size={20} stroke={1.2} />
      <Icon icon="MoonStars" size={20} stroke={1.2} />
    </Box>
  );
}

const styles = {
  root: cssObj({
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    px: '$2',
    width: '36px',
    height: '36px',
    borderRadius: '$full',

    '[aria-label*="Icon"]': {
      position: 'absolute',
      transition: 'all 0.2s ease',
    },
    '[aria-label*="SunFilled"]': {
      right: 8,
      color: '$textColor',
    },
    '[aria-label*="MoonStars"]': {
      left: 8,
      color: '$intentsInfo10',
    },

    '&[data-theme="light"]': {
      bg: '#EBEDF0',

      '[aria-label*="MoonStars"]': {
        transform: 'translateX(100%)',
        visibility: 'hidden',
        opacity: 0,
      },
    },
    '&[data-theme="dark"]': {
      bg: '#151718',

      '[aria-label*="SunFilled"]': {
        transform: 'translateX(-100%)',
        visibility: 'hidden',
        opacity: 0,
      },
    },
  }),
};
