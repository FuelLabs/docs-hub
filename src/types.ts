import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type MenuKey = string;

export type Config = {
  title: string;
  slug: string;
  repository: string;
  ogTags: {
    description: string;
    image: string;
  };
};

export type DocType = {
  title: string;
  slug: string;
  category?: string;
  pageLink: string;
  headings: NodeHeading[];
  source: MDXRemoteSerializeResult;
  menu: string[];
  docsConfig: Config;
  parent?: { label: string; link: string };
};

export type SidebarLinkItem = {
  slug?: string;
  hasIndex?: boolean;
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
