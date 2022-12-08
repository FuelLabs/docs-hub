import { getAllDocs, getDocBySlug, getSidebarLinks } from '~/src/lib/api';
import { DocScreen } from '~/src/screens/DocPage';
import type { DocType, SidebarLinkItem } from '~/src/types';

type DocPageProps = {
  doc: DocType;
  docLink: SidebarLinkItem;
  links: SidebarLinkItem[];
};

export default function DocPage(props: DocPageProps) {
  return <DocScreen {...props} />;
}

type Params = {
  params: {
    slug: string[];
  };
};

export async function getStaticProps({ params }: Params) {
  const slug = (params.slug || '')?.join('/');
  const doc = await getDocBySlug(slug);
  const links = await getSidebarLinks(doc.docsConfig?.menu || []);
  const docLink = links
    .flatMap((i) => (i.submenu || i) as SidebarLinkItem | SidebarLinkItem[])
    .find((i) => i.slug === doc.slug);

  return {
    props: {
      doc,
      docLink,
      links,
    },
  };
}
export async function getStaticPaths() {
  const docs = await getAllDocs();
  return {
    paths: docs.map((doc) => {
      return {
        params: {
          slug: [...(doc.slug || '').split('/')],
        },
      };
    }),
    fallback: false,
  };
}
