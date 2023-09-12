import { Layout } from '../components/Layout';
import { CategoryScreen } from '../screens/CategoryPage';
import type { CategoryProps } from '../types';

const sdkNavigation = {
  parent: {
    label: 'All Docs',
    link: '/',
  },
  navigation: [
    {
      label: 'Rust',
      slug: 'docs/fuels-rs',
      isExternal: false,
    },
    {
      label: 'TypeScript',
      slug: 'docs/fuels-ts',
      isExternal: false,
    },
    {
      label: 'Wallet',
      slug: 'docs/wallet',
      isExternal: false,
    },
  ],
};

const sdkCards = [
  {
    heading: '',
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
];

export default function SDK({ theme }: CategoryProps) {
  return (
    <Layout isClean isCleanWithNav title="SDK" theme={theme}>
      <CategoryScreen
        header="Fuel SDKs"
        description="Everything you need to build apps on Fuel."
        nav={sdkNavigation}
        cards={sdkCards}
      />
    </Layout>
  );
}
