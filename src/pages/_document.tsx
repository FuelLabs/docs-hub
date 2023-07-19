/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCssText } from '@fuel-ui/css';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en" data-theme="light" className="fuel_light-theme">
        <Head>
          <style
            id="stitches"
            // eslint-disable-next-line @typescript-eslint/naming-convention
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
