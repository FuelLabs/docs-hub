import { GetStaticPaths, GetStaticProps } from 'next';
import { getDocBySlug, getDocLink, getSidebarLinks } from '~/src/lib/api';
import { getDocs } from '~/src/lib/docs';
import { DocScreen } from '~/src/screens/DocPage';
import type { DocType, SidebarLinkItem } from '~/src/types';

type DocPageProps = {
  doc: DocType;
  links: SidebarLinkItem[];
  theme: string;
};

export default function DocPage(props: DocPageProps) {
  return <DocScreen {...props} />;
}

export const getStaticPaths: GetStaticPaths<any> = async () => {
  const docs = await getDocs({} as any);
  const paths = docs.map((doc) => {
    const slug = doc.slug.slice(2).split('/');
    const arr = slug
      .map((word) => (word === 'index' ? null : word))
      .map((word) => (word === 'README' ? null : word))
      .filter(Boolean);

    return {
      params: {
        slug: arr,
        path: doc.path,
      },
    };
  });

  return {
    paths: Array.from(new Set(paths)),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<any> = async (ctx) => {
  const slug = ctx.params?.slug as string[];
  const doc = await getDocBySlug(slug.join('/'));
  const links = await getSidebarLinks(doc.docsConfig.slug);
  const docLink = getDocLink(links, doc.slug);

  return {
    props: {
      theme: 'light',
      doc,
      links,
      docLink,
    },
  };
};
