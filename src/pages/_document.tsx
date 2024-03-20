import { getCssText } from '@fuel-ui/css';
import {
  darkTheme,
  lightTheme,
  loadIcons,
  setFuelThemes,
} from '@fuel-ui/react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const getThemeScript = `
function getInitialColorMode() {
  const persistedColorPreference = window.localStorage.getItem('fuel-ui-theme');
  const hasPersistedPreference = typeof persistedColorPreference === 'string';

  // If the user has explicitly chosen light or dark,
  // let's use it. Otherwise, this value will be null.
  if (hasPersistedPreference) {
    return persistedColorPreference
  }

  // If they haven't been explicit, let's check the media query
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const hasMediaQueryPreference = typeof mql.matches === 'boolean';
  if (hasMediaQueryPreference) {
    const theme = mql.matches ? 'dark' : 'light';
    return theme
  }
}

;(function() {
  const theme = getInitialColorMode();
  window.localStorage.setItem('fuel-ui-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.add('fuel_' + theme + "-theme");
  window.__FUEL_THEME__ = theme;
})()
`;

// biome-ignore lint/suspicious/noExplicitAny:
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
  initial: 'light',
  themes: {
    dark: editTheme(darkTheme),
    light: editTheme(lightTheme),
  },
});

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <Script id="theme" strategy="beforeInteractive">
            {getThemeScript}
          </Script>
          <style
            id="stitches"
            // biome-ignore lint/security/noDangerouslySetInnerHtml:
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
