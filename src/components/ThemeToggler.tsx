import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import type { ElementRef } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import useTheme from '../hooks/useTheme';

export default function ThemeToggler() {
  const { theme: current, setTheme: setFuelTheme } = useTheme();
  const [theme, setTheme] = useState(current);
  const ref = useRef<ElementRef<'div'>>(null);

  const handleChange = async () => {
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  useLayoutEffect(() => {
    setFuelTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    ref.current?.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Box ref={ref} data-theme={theme} css={styles.root} onClick={handleChange}>
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
