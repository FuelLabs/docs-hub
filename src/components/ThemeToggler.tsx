import { cssObj } from '@fuel-ui/css';
import { Box, Icon, useFuelTheme } from '@fuel-ui/react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { useDocContext } from '../hooks/useDocContext';

export function ThemeToggler() {
  const { setTheme } = useFuelTheme();
  const { theme } = useDocContext();
  const [cookie, setCookie] = useCookies(['theme']);
  const current = cookie.theme || theme;

  const handleChange = () => {
    const next = current === 'dark' ? 'light' : 'dark';
    setCookie('theme', next, { path: '/' });
    setTheme(next);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.attributes['data-theme'].value = current;
  }, [current]);

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
