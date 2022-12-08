import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type DocsConfig = {
  title: string;
  slug: string;
  menu: string[];
  slugs: string[];
  repository: string;
  paths: {
    docs: string;
    components: string;
    examples: string;
  },
  ogTags: {
    image: string;
    description: string;
  }
}

export type DocType = {
  title: string;
  slug: string;
  category?: string;
  pageLink: string;
  headings: NodeHeading[];
  source: MDXRemoteSerializeResult;
  menu: string[];
  docsConfig: DocsConfig;
};

export type SidebarLinkItem = {
  slug?: string;
  submenu?: SidebarLinkItem[];
  subpath?: string;
  label: string;
  prev?: SidebarLinkItem;
  next?: SidebarLinkItem;
};

export type NodeHeading = {
  title: string;
  id: string;
  children?: NodeHeading[];
};
