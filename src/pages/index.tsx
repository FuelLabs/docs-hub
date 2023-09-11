import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import { HomeScreen } from '../screens/HomePage';

import type { GuideInfo } from './guides';

interface HomeProps {
  theme: string;
  guides: { [key: string]: GuideInfo };
}

const homeNavigation = {
  navigation: [
    {
      label: 'Get Started',
      slug: '/guides/quickstart',
      isExternal: false,
    },
    {
      label: 'Sway Language',
      slug: '/sway',
      isExternal: false,
    },
    {
      label: 'Tooling',
      slug: '/tooling',
      isExternal: false,
    },
    {
      label: 'SDKs',
      slug: '/sdk',
      isExternal: false,
    },
    {
      label: 'Network',
      slug: '/network',
      isExternal: false,
    },
  ],
};

const homeCards = [
  {
    link: '/sway',
    isExternal: false,
    heading: 'Sway Language',
    headingIcon: 'Code',
    body: 'Build powerful programs with a Rust-based DSL, without needlessly verbose boilerplate.',
  },
  {
    link: '/tooling',
    isExternal: false,
    heading: 'Tooling',
    headingIcon: 'Settings',
    body: 'Explore the best tooling you need to build your next web3 app in the fastest execution layer.',
  },
  {
    link: '/sdk',
    isExternal: false,
    heading: 'SDKs',
    headingIcon: 'Book',
    body: 'Integrate Fuel into a Typescript or Rust project in minutes.',
  },
  {
    link: '/network',
    isExternal: false,
    heading: 'Network',
    headingIcon: 'Bolt',
    body: 'Find network specifications and resources.',
  },
];

export default function Home({ theme, guides }: HomeProps) {
  return (
    <Layout isClean isCleanWithNav title="Fuel Docs" theme={theme}>
      <HomeScreen
        guides={guides}
        homeNavigation={homeNavigation}
        homeCards={homeCards}
      />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `../docs/guides/docs/guides.json`);
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));

  return { props: { guides } };
};
