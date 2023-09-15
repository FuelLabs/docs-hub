import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';
import { LATEST_DOCS_DIRECTORY } from '~/src/config/constants';

import type { GuidesProps } from './index';
import Guides from './index';

export default function LatestGuides({ guides }: GuidesProps) {
  return <Guides guides={guides} isLatest={true} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(LATEST_DOCS_DIRECTORY, `./guides/docs/guides.json`);
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));

  return { props: { guides } };
};
