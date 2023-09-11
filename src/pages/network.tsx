import { Layout } from '../components/Layout';
import { CategoryScreen } from '../screens/CategoryPage';
import type { CategoryProps } from '../types';

const networkNavigation = {
  parent: {
    label: 'All Docs',
    link: '/',
  },
  navigation: [
    {
      label: 'GraphQL API',
      slug: 'docs/graphql',
      isExternal: false,
    },
    {
      label: 'Specs',
      slug: 'docs/specs',
      isExternal: false,
    },
    {
      label: 'Faucet',
      slug: 'https://faucet-beta-4.fuel.network/',
      isExternal: true,
    },
  ],
};

const networkCards = [
  {
    heading: 'Fuel Network',
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

export default function Network({ theme }: CategoryProps) {
  return (
    <Layout isClean isCleanWithNav title="Network" theme={theme}>
      <CategoryScreen nav={networkNavigation} cards={networkCards} />
    </Layout>
  );
}
