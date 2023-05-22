import {
  getAllDocs,
  getDocBySlug,
  getDocLink,
  getSidebarLinks,
} from '~/src/lib/api';
import { joinSlug, splitSlug } from '~/src/lib/docs';
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
  const doc = await getDocBySlug(joinSlug(params.slug));
  let slug = params.slug[0].split('/')[0];
  let config = doc.docsConfig;
  const slugConfig = config[slug];
  let order = slugConfig.menu;
  const links = await getSidebarLinks(order || []);
  const docLink = getDocLink(links, doc.slug);
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
      let arr = (doc.slug || '').split('/');
      if (arr[0].startsWith('..')) arr.shift();
      return {
        params: {
          slug: [...arr],
        },
      };
    }),
    fallback: false,
  };
}
