import {
  getDocBySlug,
  getSidebarLinks,
  getAllDocs
} from '~/src/lib/api';
import { DocScreen } from '~/src/screens/DocPage';
import type { DocType, SidebarLinkItem } from '~/src/types';

type DocPageProps = {
  doc: DocType;
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
  // console.log("SLUG:", params.slug)
  const doc = await getDocBySlug(params.slug.join('/'));
  const links = await getSidebarLinks(doc.docsConfig.slug);
  return {
    props: {
      doc,
      links,
    },
  };
}

export async function getStaticPaths() {
  const docs = await getAllDocs();
  return {
    paths: docs.map((doc) => {
      let arr = (doc.slug || '').split('/');
      if (arr[0].startsWith('.')) arr.shift();
      return {
        params: {
          slug: [...arr],
        },
      };
    }),
    fallback: false,
  };
}