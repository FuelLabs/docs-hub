import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import { HomeScreen } from '../screens/HomePage';

import type { GuideInfo } from './guides';

export interface NavOrder {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links: any[];
}

interface HomeProps {
  theme: string;
  guides: { [key: string]: GuideInfo };
  allNavs: NavOrder[];
}

const homeCards = [
  {
    header: 'Sway Language',
    link: '/sway',
    cards: [
      {
        link: '/docs/sway',
        isExternal: false,
        heading: 'Sway',
        headingIcon: 'Code',
        body: 'Read the official Sway documentation.',
      },
      {
        link: 'https://github.com/FuelLabs/sway-applications',
        isExternal: true,
        heading: 'Example Applications',
        headingIcon: 'Apps',
        body: 'Explore end-to-end applications written in Sway.',
      },
      {
        link: 'https://github.com/FuelLabs/sway-applications',
        isExternal: true,
        heading: 'Sway Playground',
        headingIcon: 'Browser',
        body: 'Get started experimenting with Sway in the browser.',
      },
    ],
  },
  {
    header: 'Tooling',
    // link: '/tooling',
    cards: [
      {
        link: '/docs/forc',
        isExternal: false,
        heading: 'Forc',
        headingIcon: 'Tool',
        body: 'Explore tools and commands building on Fuel.',
      },
      {
        link: '/docs/fuelup',
        isExternal: false,
        heading: 'Fuelup',
        headingIcon: 'Settings',
        body: 'Learn more about the official package manager for Fuel.',
      },
      {
        link: '/docs/indexer',
        isExternal: false,
        heading: 'Indexer',
        headingIcon: 'LayoutGrid',
        body: 'Find tooling to index data on the Fuel network.',
      },
    ],
  },
  {
    header: 'SDKs',
    // link: '/sdk',
    cards: [
      {
        link: '/docs/fuels-rs',
        isExternal: false,
        heading: 'Rust SDK',
        headingIcon: 'BrandRust',
        body: 'Read the documentation for the Rust SDK.',
      },
      {
        link: '/docs/fuels-ts',
        isExternal: false,
        heading: 'Typescript SDK',
        headingIcon: 'BrandTypescript',
        body: 'Read the documentation for the TypeScript SDK.',
      },
      {
        link: '/docs/wallet',
        isExternal: false,
        heading: 'Wallet',
        headingIcon: 'Wallet',
        body: 'Read the documentation for the Fuel Wallet.',
      },
    ],
  },
  {
    header: 'Network',
    // link: '/network',
    cards: [
      {
        link: '/docs/graphql',
        isExternal: false,
        heading: 'GraphQL API',
        headingIcon: 'ChartDots3',
        body: 'Read the documentation for the GraphQL API.',
      },
      {
        link: '/docs/specs',
        isExternal: false,
        heading: 'Specs',
        headingIcon: 'ListDetails',
        body: 'Explore the specifications for the Fuel Network.',
      },
      {
        link: 'https://faucet-beta-4.fuel.network/',
        isExternal: true,
        heading: 'Faucet',
        headingIcon: 'Coin',
        body: 'Get beta-4 testnet tokens.',
      },
    ],
  },
];

export default function Home({ theme, guides, allNavs }: HomeProps) {
  return (
    <Layout
      allNavs={allNavs}
      isClean
      isCleanWithNav
      title="Fuel Docs"
      theme={theme}
    >
      <HomeScreen guides={guides} allNavs={allNavs} homeCards={homeCards} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `./guides/docs/guides.json`);
  const allNavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-orders.json`
  );
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));

  return { props: { guides, allNavs } };
};
