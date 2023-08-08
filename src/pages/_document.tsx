import { getCssText } from '@fuel-ui/css';
import Document, { Html, Head, Main, NextScript } from 'next/document';
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
  window.__FUEL_THEME__ = theme;
})()
`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
          <Script id="theme" strategy="beforeInteractive">
            {getThemeScript}
          </Script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
