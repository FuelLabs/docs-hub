/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton, Text } from '@fuel-ui/react';
import { Children } from 'react';
import type { ReactNode } from 'react';

type PreProps = {
  children: ReactNode;
  title?: ReactNode;
  css?: ThemeUtilsCSS;
};

export function Pre({ css, children, title }: PreProps) {
  const codeEl: any = Children.toArray(children)[0];
  const codeStr = codeEl?.props.children || '';
  const code = codeStr.endsWith('\n') ? codeStr.slice(0, -1) : codeStr;
  const lang = codeEl?.props.className
    ? codeEl?.props.className.replace('language-', '')
    : 'rust';

  let html = '';
  let raw = '';

  try {
    // this ~workaround~ solution is to be able to have a copy button
    const parsed = JSON.parse(code);
    if (parsed.__isHighlight) {
      html = parsed.html;
      raw = parsed.raw;
    } else {
      html = code;
      raw = code;
    }
  } catch (e) {
    html = code;
    raw = code;
  }

  return (
    <Box css={{ ...styles.root, ...css }} data-language={lang}>
      <IconButton
        size="xs"
        icon={Icon.is('ClipboardText')}
        css={styles.copyIcon}
        variant="ghost"
        intent="base"
        aria-label="Copy to Clipborad"
        onPress={() =>
          typeof window !== 'undefined' && navigator.clipboard.writeText(raw)
        }
      />
      {title && <Text as="h6">{title}</Text>}
      <div dangerouslySetInnerHTML={{ __html: html }} />
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
      mb: '$0 !important',
      padding: '$0 $5 $3',
      background: 'var(--colors-preBg) !important',
      tabSize: '4',
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

    '.linenumber': {
      display: 'inline-flex',
      width: '20px',
      mr: '$6',
      justifyContent: 'flex-end',
    },
    '.line.code': {
      display: 'inline-flex',
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
