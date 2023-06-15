import {
  getDocBySlug,
  getSidebarLinks,
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

export async function getServerSideProps({ params }: Params) {
  const doc = await getDocBySlug(params.slug.join('/'));
  const links = await getSidebarLinks(doc.docsConfig);
  return {
    props: {
      doc,
      links,
    },
  };
}
