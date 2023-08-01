import type { GetStaticProps } from 'next';

import type { MdDoc } from '../../.contentlayer/generated';
import { allMdDocs } from '../../.contentlayer/generated';
import useTheme from '../hooks/useTheme';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';
import { DocScreen } from '../screens/DocPage';
import type { DocType, SidebarLinkItem } from '../types';

export type DocPageProps = {
  code: string;
  md: MdDoc;
  doc: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
  theme: string;
};

export default function DocPage(props: DocPageProps) {
  const { theme } = useTheme();
  return <DocScreen {...props} theme={theme} />;
}

export function getStaticPaths() {
  const paths = Docs.getAllPaths(allMdDocs);
  return { paths, fallback: false };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const doc = new Doc(params?.slug as string[], allMdDocs);
  const code = await doc.getCode();
  return {
    props: {
      code,
      md: doc.md,
      doc: doc.item,
      links: doc.sidebarLinks,
      docLink: doc.navLinks,
    },
  };
};
