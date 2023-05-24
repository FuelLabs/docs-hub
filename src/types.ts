import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type MenuKey = string;

export type Config = {
  [key in MenuKey]?: string[];
} & {
  title: string;
  slug: string;
  paths: {
    docs: string;
    components: string;
    examples: string;
  };
  repository: string;
  ogTags: {
    description: string;
    image: string;
  };
  menu: string[];
};

export type DocsConfig = {
  [key: string]: Config;
};

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
