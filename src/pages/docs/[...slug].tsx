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

  const slug = params.slug.join('/');
  const slugs = await getDocs(doc.docsConfig);

  const rust = [
    // RUST SDK DOCS
    './fuels-rs/docs/src/**/*.md',
    './fuels-rs/docs/src/*.md',
    // IGNORE ALL SUMMARY PAGES
    '!**/SUMMARY.md',
  ];

  const sway = [
    // SWAY DOCS
    './sway/docs/book/src/**/*.md',
    './sway/docs/book/src/*.md',
    // IGNORE ALL SUMMARY PAGES
    '!**/SUMMARY.md',
    // IGNORE FORC PAGES
    '!./sway/docs/book/src/forc/*.md',
    '!./sway/docs/book/src/forc/**/*.md',
  ];

  const rustPaths = await globby(rust, {
    cwd: DOCS_DIRECTORY,
  });
  const swayPaths = await globby(sway, {
    cwd: DOCS_DIRECTORY,
  });

  const extra: any = {};
  extra.slugs = slugs;
  extra.slug = slug;
  extra.rustPaths = rustPaths;
  extra.swayPaths = swayPaths;

  return {
    props: {
      doc,
      links,
      extra
    },
  };
}
