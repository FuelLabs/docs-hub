import {
  getDocBySlug,
  // getDocLink,
  getSidebarLinks,
} from '~/src/lib/api';
import { joinSlug } from '~/src/lib/docs';
import { DocScreen } from '~/src/screens/DocPage';
import type { DocType, SidebarLinkItem } from '~/src/types';

type DocPageProps = {
  doc: DocType;
  // docLink: SidebarLinkItem;
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
  const doc = await getDocBySlug(joinSlug(params.slug));
  const links = await getSidebarLinks(doc.docsConfig);
  // const docLink = getDocLink(links, doc.slug);
  return {
    props: {
      doc,
      // docLink,
      links,
    },
  };
}
