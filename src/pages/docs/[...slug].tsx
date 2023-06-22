/* eslint-disable @typescript-eslint/no-explicit-any */
import { globby } from 'globby';
import { DOCS_DIRECTORY } from '~/src/constants';
import {
  getDocBySlug,
  getSidebarLinks,
} from '~/src/lib/api';
import { getDocs } from '~/src/lib/docs';
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

  const sway1 = [
    // SWAY DOCS
    './sway/docs/book/src/*',
  ];

  const sway2 = [
    // SWAY DOCS
    './sway/docs/book/src/**',
  ];

  const sway3 = [
    // SWAY DOCS
    './sway/docs/book/src/README.md',
  ];
  const sway4 = [
  // SWAY DOCS
  './sway/docs/book/src/**/*.md',
  ];


  const swayPaths1 = await globby(sway1, {
    cwd: DOCS_DIRECTORY,
  });
  const swayPaths2 = await globby(sway2, {
    cwd: DOCS_DIRECTORY,
  });
  const swayPaths3 = await globby(sway3, {
    cwd: DOCS_DIRECTORY,
  });
  const swayPaths4 = await globby(sway4, {
    cwd: DOCS_DIRECTORY,
  });

  const extra: any = {};
  extra.swayPaths1 = swayPaths1;
  extra.swayPaths2 = swayPaths2;
  extra.swayPaths3 = swayPaths3;
  extra.swayPaths4 = swayPaths4;

  return {
    props: {
      doc,
      links,
      extra
    },
  };
}
