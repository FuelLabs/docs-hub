import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import {
  getDocBySlug,
  getDocLink,
  getSidebarLinks,
} from '~/src/lib/api';
import { DocScreen } from '~/src/screens/DocPage';
import type { DocType, SidebarLinkItem } from '~/src/types';

type DocPageProps = {
  doc: DocType;
  links: SidebarLinkItem[];
  theme: string
};

export default function DocPage(props: DocPageProps) {
  return <DocScreen {...props} />;
}


export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  const slug = ctx.params?.slug as string[];
  const doc = await getDocBySlug(slug.join('/'));
  const links = await getSidebarLinks(doc.docsConfig.slug);
  const docLink = getDocLink(links, doc.slug);
  const theme = getCookie('theme', ctx) || 'dark';

  return {
    props: {
      theme,
      doc,
      links,
      docLink
    },
  };
}
