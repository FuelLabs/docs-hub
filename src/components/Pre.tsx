/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton, Text } from '@fuel-ui/react';
import { Children } from 'react';
import type { ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/night-owl';

type PreProps = {
  children: ReactNode;
  title?: ReactNode;
  css?: ThemeUtilsCSS;
};

export function Pre({ css, children, title }: PreProps) {
  const codeEl: any = Children.toArray(children)[0];
  const codeStr = codeEl?.props.children || '';
  const code = codeStr.endsWith('\n') ? codeStr.slice(0, -1) : codeStr;
  const language = codeEl?.props.className
    ? codeEl?.props.className.replace('language-', '')
    : 'rust';

  return (
    <Box css={{ ...styles.root, ...css }}>
      <IconButton
        size="xs"
        icon={Icon.is('ClipboardText')}
        css={styles.copyIcon}
        variant="ghost"
        intent="base"
        aria-label="Copy to Clipborad"
        onPress={() =>
          typeof window !== 'undefined' && navigator.clipboard.writeText(code)
        }
      />
      {title && <Text as="h6">{title}</Text>}
      <SyntaxHighlighter
        language={
          language === 'rs' ||
          language.startsWith('rust') ||
          language.startsWith('sway')
            ? 'rust'
            : language
        }
        style={theme}
        data-title={Boolean(title)}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

const styles = {
  root: cssObj({
    boxSizing: 'border-box',
    position: 'relative',
    maxHeight: '450px',
    overflow: 'auto',
    borderRadius: '$default',
    background: 'var(--colors-preBg) !important',
    my: '$6',

    pre: {
      pr: '50px',
      mb: '$0 !important',
      padding: '$2 $2 $3 !important',
      background: 'var(--colors-preBg) !important',
      fontSize: '14px !important',
    },
    'pre[data-title=true]': {
      marginTop: '$0 !important',
      borderTopLeftRadius: '$0',
      borderTopRightRadius: '$0',
    },

    h6: {
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      padding: '$1 $3',
      background: '$intentsBase2',
      color: '$intentsBase10',
      borderTopLeftRadius: '$lg',
      borderTopRightRadius: '$lg',
      borderBottom: '2px solid $bodyColor',

      span: {
        fontSize: '$sm',
      },
      a: {
        color: '$intentsBase10',
      },
    },

    '.token.plain': {
      color: '$intentsBase11',
    },

    '.linenumber': {
      boxSizing: 'border-box',
      minWidth: '30px !important',
      color: '$intentsBase8 !important',
      mr: '$1',
    },
  }),
  copyIcon: cssObj({
    position: 'absolute',
    right: 0,
    top: 0,
    color: '$intentsBase6',
    transition: 'all .3s',
    background: 'transparent',
    borderColor: 'transparent',

    '&:hover': {
      color: '$intentsBase9',
    },
  }),
};
