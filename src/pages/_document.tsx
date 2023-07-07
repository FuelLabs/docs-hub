/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCssText } from '@fuel-ui/css';
import type { DocumentContext, DocumentInitialProps } from 'next/document';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps & { cookies: any }> {
    const props = await NextDocument.getInitialProps(ctx);
    const cookies = (ctx.req as any)?.cookies;
    return { ...props, cookies };
  }

  render() {
    const cookies = (this.props as any).cookies;
    return (
      <Html lang="en" data-theme={cookies?.theme || 'light'}>
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
