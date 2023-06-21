import { join } from 'path';
import { DOCS_DIRECTORY } from '~/src/constants';
import {
  getDocBySlug,
  getSidebarLinks,
} from '~/src/lib/api';
import { getDocConfig, getDocFromSlug } from '~/src/lib/docs';
import { DocScreen } from '~/src/screens/DocPage';
import type { DocType, SidebarLinkItem } from '~/src/types';

type DocPageProps = {
  doc: DocType;
  links: SidebarLinkItem[];
  extra: any;
};

export default function DocPage(props: DocPageProps) {
  console.log("EXTRA:", props.extra)
  return <DocScreen doc={props.doc} links={props.links}/>;
  // return <DocScreen {...props} />;
}

type Params = {
  params: {
    slug: string[];
  };
};

export async function getServerSideProps({ params }: Params) {
  const doc = await getDocBySlug(params.slug.join('/'));
  const links = await getSidebarLinks(doc.docsConfig.slug);

  const slug = params.slug.join('/');
  const docsConfig = await getDocConfig(slug);
  const slugPath = await getDocFromSlug(slug, docsConfig);
  const fullpath = join(DOCS_DIRECTORY, slugPath.path);
  const extra: any = {};
  extra.docsConfig = docsConfig;
  extra.slugPath = slugPath;
  extra.fullpath = fullpath;

  return {
    props: {
      doc,
      links,
      extra
    },
  };
}
