/* eslint-disable @typescript-eslint/no-explicit-any */
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

  if(props.extra.slug & props.extra.slugs){
    const slug = props.extra.slug;
    const slugs = props.extra.slugs;
    let slugPath = slugs.find(
      ({ slug: pathSlug }: any) => {
        console.log("PATH SLUG:", pathSlug)
        pathSlug === `./${slug}.md`
      }
    );
    if (!slugPath) {
      slugPath = slugs.find(({ slug: pathSlug }: any) => pathSlug.includes(slug));
    }
    if (!slugPath) {
      throw new Error(`${slug} not found`);
    }
  }
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

  const extra: any = {};
  extra.slugs = slugs;
  extra.slug = slug;

  return {
    props: {
      doc,
      links,
      extra
    },
  };
}
