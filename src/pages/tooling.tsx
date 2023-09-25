import { Layout } from '../components/Layout';
import { CategoryScreen } from '../screens/CategoryPage';
import type { CategoryProps } from '../types';

// const toolingNavigation = {
//   parent: {
//     label: 'All Docs',
//     link: '/',
//   },
//   navigation: [
//     {
//       label: 'Forc',
//       slug: 'docs/forc',
//       isExternal: false,
//     },
//     {
//       label: 'Fuelup',
//       slug: 'docs/fuelup',
//       isExternal: false,
//     },
//     {
//       label: 'Indexer',
//       slug: 'docs/indexer',
//       isExternal: false,
//     },
//   ],
// };

const toolingCards = [
  {
    heading: '',
    cards: [
      {
        link: '/docs/forc',
        isExternal: false,
        heading: 'Forc',
        headingIcon: 'Tool',
        body: 'Read the documentation for the Fuel Orchestrator.',
      },
      {
        link: '/docs/fuelup',
        isExternal: false,
        heading: 'Fuelup',
        headingIcon: 'Settings',
        body: 'Read the documentation for Fuelup.',
      },
      {
        link: '/docs/indexer',
        isExternal: false,
        heading: 'Indexer',
        headingIcon: 'LayoutGrid',
        body: 'Read the documentation for the Fuel Indexer.',
      },
    ],
  },
];

export default function Tooling({ theme }: CategoryProps) {
  return (
    <Layout isClean isCleanWithNav title="Tooling" theme={theme}>
      <CategoryScreen
        header="Tooling"
        description="All the tools you need to develop & deploy."
        // nav={toolingNavigation}
        cards={toolingCards}
      />
    </Layout>
  );
}
