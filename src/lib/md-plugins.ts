import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';

import { fixIndent } from './plugins/fix-indent';
import { handlePlugins } from './plugins/plugins';
import { getMdxCode } from './plugins/rehype-code';

export const remarkPlugins = [remarkSlug, remarkGfm, handlePlugins, fixIndent];

export const rehypePlugins = getMdxCode();
