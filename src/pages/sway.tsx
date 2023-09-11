import { Layout } from '../components/Layout';
import { CategoryScreen } from '../screens/CategoryPage';
import type { CategoryProps } from '../types';

const swayNavigation = {
  parent: {
    label: 'All Docs',
    link: '/',
  },
  navigation: [
    {
      label: 'Sway',
      slug: 'docs/sway',
      isExternal: false,
    },
    {
      label: 'Example Apps',
      slug: 'https://github.com/FuelLabs/sway-applications',
      isExternal: true,
    },
    {
      label: 'Standard Library',
      slug: 'https://fuellabs.github.io/sway/master/std',
      isExternal: true,
    },
    {
      label: 'Sway Core',
      slug: 'https://fuellabs.github.io/sway/master/core',
      isExternal: true,
    },
  ],
};

const swayCards = [
  {
    heading: 'Sway',
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
    ],
  },
  {
    heading: 'References',
    cards: [
      {
        link: 'https://fuellabs.github.io/sway/master/std',
        isExternal: true,
        heading: 'Standard Library',
        headingIcon: 'Book',
        body: 'Reference for the std-lib.',
      },
      {
        link: 'https://fuellabs.github.io/sway/master/core',
        isExternal: true,
        heading: 'Sway Core',
        headingIcon: 'FocusCentered',
        body: 'Reference for Sway Core.',
      },
    ],
  },
];

export default function Sway({ theme }: CategoryProps) {
  return (
    <Layout isClean isCleanWithNav title="Sway Language" theme={theme}>
      <CategoryScreen nav={swayNavigation} cards={swayCards} />
    </Layout>
  );
}
