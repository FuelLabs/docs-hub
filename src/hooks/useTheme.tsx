import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import useSWR, { mutate } from 'swr';

let INITIAL_THEME: string;
const KEY = 'fuel-ui-theme';

if (typeof window !== 'undefined') {
  INITIAL_THEME = localStorage.getItem(KEY) || 'light';
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error('Failed to fetch the theme.');
  }
  const theme = (await res.json()).theme;
  return theme || INITIAL_THEME;
}

export default function useTheme() {
  const [cookie, setCookie] = useCookies(['theme']);
  const { data = cookie || INITIAL_THEME, error } = useSWR(
    '/api/theme',
    fetcher
  );

  const setTheme = async (theme: string) => {
    await fetch('/api/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
    });
    const data = await mutate('/api/theme', theme, false);
    setCookie('theme', data, { path: '/' });
    localStorage.setItem(KEY, data as string);
  };

  const resetTheme = async () => {
    await fetch('/api/theme', { method: 'DELETE' });
    mutate('/api/theme', 'default', false);
  };

  useEffect(() => {
    document.documentElement.attributes['data-theme'].value = data;
    if (data === 'light') {
      document.documentElement.classList.remove('fuel_dark-theme');
      document.documentElement.classList.add('fuel_light-theme');
    } else {
      document.documentElement.classList.add('fuel_dark-theme');
      document.documentElement.classList.remove('fuel_light-theme');
    }
  }, [data]);

  return {
    theme: data,
    isLoading: !error && !data,
    isError: error,
    setTheme,
    resetTheme,
  };
}
