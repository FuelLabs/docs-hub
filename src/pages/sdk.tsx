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
    heading: 'SDKs',
    cards: [
      {
        link: '/docs/fuels-rs',
        isExternal: false,
        heading: 'Rust SDK',
        headingIcon: 'BrandRust',
        body: 'Read the Rust SDK Docs',
      },
      {
        link: '/docs/fuels-ts',
        isExternal: false,
        heading: 'Typescript SDK',
        headingIcon: 'BrandTypescript',
        body: 'Read the TypeScript SDK Docs',
      },
      {
        link: '/docs/wallet',
        isExternal: false,
        heading: 'Wallet',
        headingIcon: 'Wallet',
        body: 'Read the Fuel Wallet SDK Docs',
      },
    ],
  },
];

export default function SDK({ theme }: CategoryProps) {
  return (
    <Layout isClean isCleanWithNav title="SDK" theme={theme}>
      <CategoryScreen nav={sdkNavigation} cards={sdkCards} />
    </Layout>
  );
}
