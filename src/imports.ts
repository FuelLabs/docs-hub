/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DocType } from './types';

export function getComponents(doc: DocType) {
  const slug = doc.docsConfig.slug || '';
  const components = {} as any;

  if (slug.includes('wallet')) {
    console.log('wallet');
  }

  return components;
}
