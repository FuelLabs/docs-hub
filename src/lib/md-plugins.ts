import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import { codeImport } from './plugins/code-import';
import { fixIndent } from './plugins/fix-indent';
import { handlePlugins } from './plugins/plugins';
import { getMdxCode } from './plugins/rehype-code';
import { codeImport as walletCodeImport } from './plugins/wallet-code-import';

export const remarkPlugins = [
  remarkSlug,
  remarkGfm,
  handlePlugins,
  fixIndent,
  walletCodeImport,
  codeImport,
];

export const rehypePlugins = getMdxCode();
