/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCssText } from '@fuel-ui/css';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import { Cookies } from 'react-cookie';

export default class Document extends NextDocument {
  static async getInitialProps(ctx: any): Promise<any> {
    const originalRenderPage = ctx.renderPage;
    const cookies = new Cookies(ctx.req.headers.cookie);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceComponent: (Component: any) => {
          Component.universalCookies = cookies;
          return Component;
        },
      });

    const props = await NextDocument.getInitialProps(ctx);
    return { ...props, cookies: cookies.getAll() };
  }

  render() {
    const cookies = (this.props as any).cookies;
    return (
      <Html
        lang="en"
        data-theme={cookies.theme || 'dark'}
        className={
          cookies.theme === 'light' ? 'fuel_light-theme' : 'fuel_dark-theme'
        }
      >
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
