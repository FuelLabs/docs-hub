import { readFileSync } from 'fs';
import { join } from 'path';
import { DEFAULT_SLUG, FIELDS } from '~/src/constants';
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
  const slug = (params.slug || DEFAULT_SLUG)?.join('/');
  const doc = await getDocBySlug(slug, FIELDS);
  const navPath = join(process.cwd(), './src/nav.json');
  const navFile = JSON.parse(readFileSync(navPath, 'utf8'));
  const links = await getSidebarLinks(navFile.menu);
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
  const docs = await getAllDocs(FIELDS);
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
