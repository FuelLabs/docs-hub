import { getCookie, setCookie } from 'cookies-next';
import type { GetServerSideProps } from 'next';
import { DEFAULT_THEME } from '~/src/constants';
import { getDocBySlug, getDocLink, getSidebarLinks } from '~/src/lib/api';
import { DocScreen } from '~/src/screens/DocPage';

import type { DocPageProps } from '../docs/[...slug]';

export default function DocPage(props: DocPageProps) {
  return <DocScreen {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  const slug = ctx.params?.slug as string[];
  const doc = await getDocBySlug(`guides/${slug.join('/')}`);
  const links = await getSidebarLinks(doc.docsConfig.slug, slug[0]);
  const docLink = getDocLink(links, doc.slug);
  const theme = getCookie('theme', ctx) || DEFAULT_THEME;

  if (!theme) {
    setCookie('theme', DEFAULT_THEME, ctx);
  }

  return {
    props: {
      theme: theme || DEFAULT_THEME,
      doc,
      links,
      docLink,
    },
  };
};
