import remarkGfm from 'remark-gfm';

import { fixIndent } from './plugins/fix-indent';
import { handlePlugins } from './plugins/plugins';
import { getMdxCode } from './plugins/rehype-code';

export const remarkPlugins = [remarkGfm, handlePlugins, fixIndent];

export const rehypePlugins = (theme: 'light' | 'dark') => getMdxCode(theme);
