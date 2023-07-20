/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { ComponentType } from 'react';

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

export interface ComponentObject {
  [key: string]: ComponentType<any>;
}

export interface Component {
  name: string;
  import?: ComponentType<any>;
  imports?: ComponentObject;
}

export interface ComponentsList {
  [key: string]: Component[];
}
