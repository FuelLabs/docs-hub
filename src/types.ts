/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RawDocumentData } from 'contentlayer/core';
import type { ComponentType } from 'react';

export type CategoryProps = {
  theme: string;
};

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
  _raw: RawDocumentData;
  title: string;
  slug: string;
  category?: string;
  pageLink: string;
  headings: NodeHeading[];
  menu: string[];
  docsConfig: Config;
  parent?: { label: string; link: string };
};

export type SidebarLinkItem = {
  slug: string;
  isExternal: boolean;
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
  [key: string]: ComponentType<any> | ComponentObject;
}

export interface Component {
  name: string;
  import?: ComponentType<any>;
  imports?: ComponentObject;
}

export interface ComponentsList {
  [key: string]: Component[];
}
