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

export type VersionSet = 'default' | 'nightly' | 'beta-4';

export type DocType = {
  _raw: RawDocumentData;
  title: string;
  originalSlug: string;
  slug: string;
  category?: string;
  pageLink: string;
  headings: NodeHeading[];
  menu: string[];
  docsConfig: Config;
  parent?: { label: string; link: string };
  versionSet: VersionSet;
};

export type BreadCrumb = {
  label: string;
  link?: string;
};

export type SidebarLinkItem = {
  slug: string;
  isExternal: boolean;
  hasIndex?: boolean;
  submenu?: SidebarLinkItem[];
  subpath?: string;
  label: string;
  breadcrumbs: BreadCrumb[];
  prev?: SidebarLinkItem;
  next?: SidebarLinkItem;
};

export type NodeHeading = {
  title: string;
  id: string;
  children?: NodeHeading[];
};

export interface ComponentObject {
  // biome-ignore lint/suspicious/noExplicitAny:
  [key: string]: ComponentType<any> | ComponentObject;
}

export interface Component {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny:
  import?: ComponentType<any>;
  imports?: ComponentObject;
}

export interface ComponentsList {
  [key: string]: Component[];
}

export interface NavOrder {
  key: string;
  sidebarName: string;
  // biome-ignore lint/suspicious/noExplicitAny:
  links: any[];
}

export type VersionItem = {
  version: string;
  name: string;
  category: string;
  url: string;
};

export type Versions = {
  Forc: VersionItem;
  Sway: VersionItem;
  Fuelup: VersionItem;
  'Fuel Rust SDK': VersionItem;
  'Fuel TS SDK': VersionItem;
  'Fuel Wallet': VersionItem;
};
