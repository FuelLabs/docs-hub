import { GetStaticProps } from 'next';
import { allMdDocs, MdDoc } from '~/.contentlayer/generated';
import { Doc } from '~/src/lib2/Doc';
import { Docs } from '~/src/lib2/Docs';
import { DocScreen } from '~/src/screens/DocPage';
import type { DocType, SidebarLinkItem } from '~/src/types';

export type DocPageProps = {
  code: string;
  md: MdDoc;
  doc: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
  theme: string;
};

export default function DocPage(props: DocPageProps) {
  return <DocScreen {...props} />;
}

export function getStaticPaths() {
  const paths = Docs.getAllPaths(allMdDocs);
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const doc = new Doc(params?.slug as string[], allMdDocs);
  const code = await doc.getCode();
  return {
    props: {
      code,
      theme: 'light',
      md: doc.md,
      doc: doc.item,
      links: doc.sidebarLinks,
      docLink: doc.navLinks,
    },
  };
};
