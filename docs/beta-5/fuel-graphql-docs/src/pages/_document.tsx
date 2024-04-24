import { getCssText } from '@fuel-ui/css';
import { loadIcons } from '@fuel-ui/react';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';

loadIcons('/sprite.svg');

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" data-theme="dark">
        <Head>
          <style
            id="stitches"
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
