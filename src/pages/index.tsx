/* eslint-disable import/no-named-default */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  default as DocPage,
  getStaticProps as docsGetProps,
} from './docs/[...slug]';

export default function Home(props: any) {
  return <DocPage {...props} />;
}

export async function getStaticProps() {
  return docsGetProps({ params: { slug: ['portal/home'] } });
}
