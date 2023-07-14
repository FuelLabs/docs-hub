import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton, Text, toast } from '@fuel-ui/react';
import type { ReactNode } from 'react';

type PreProps = {
  children: ReactNode;
  title?: ReactNode;
  css?: ThemeUtilsCSS;
  __code?: string;
  className?: string;
};

export function Pre({
  css,
  children,
  title,
  __code: code,
  ...props
}: PreProps) {
  function handleCopy() {
    typeof window !== 'undefined' &&
      code &&
      navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  }
  return (
    <Box css={{ ...styles.root, ...css }}>
      <IconButton
        size="xs"
        icon={Icon.is('ClipboardText')}
        css={styles.copyIcon}
        variant="ghost"
        intent="base"
        aria-label="Copy to Clipborad"
        onPress={handleCopy}
      />
      {title && <Text as="h6">{title}</Text>}
      <pre {...props}>{children}</pre>
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

    'pre code': {
      all: 'unset',
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

    'span[data-line]': {
      display: 'inline-block',

      '&:before': {
        content: 'attr(data-line)',
        display: 'inline-block',
        width: '2em',
        userSelect: 'none',
        opacity: 0.5,
        marginRight: '$2',
        color: '$intentsBase10',
      },
    },
  }),
  copyIcon: cssObj({
    position: 'absolute',
    right: 0,
    top: 0,
    transition: 'all .3s',
    background: 'transparent',
    borderColor: 'transparent',

    '&:hover': {
      bg: 'transparent !important',
      borderColor: 'transparent !important',
    },

    '& .fuel_Icon': {
      color: '$textSubtext !important',
    },
    '&:hover .fuel_Icon': {
      color: '$textLink !important',
    },
  }),
};
