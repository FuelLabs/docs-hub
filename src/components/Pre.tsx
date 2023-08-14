import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Button, Icon, IconButton, Text, toast } from '@fuel-ui/react';
import { useState, type ReactNode } from 'react';

type PreProps = {
  children: ReactNode;
  title?: ReactNode;
  css?: ThemeUtilsCSS;
  __lines?: number;
  __code?: string;
  className?: string;
};

export function Pre({
  css,
  children,
  title,
  __code: code,
  __lines: lines = 0,
  ...props
}: PreProps) {
  const [expanded, setExpanded] = useState(false);
  const needExpand = lines >= 32;

  function handleCopy() {
    typeof window !== 'undefined' &&
      code &&
      navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  }

  function toggleExpand() {
    setExpanded(!expanded);
  }

  return (
    <Box css={{ ...styles.root, ...css }}>
      {title && <Text as="h6">{title}</Text>}
      <Box
        css={styles.wrapper}
        data-expanded={expanded}
        data-need-expand={needExpand}
      >
        <pre {...props}>{children}</pre>
      </Box>
      <Box css={styles.actions} data-expanded={expanded}>
        {needExpand && (
          <Button variant="outlined" size="xs" onPress={toggleExpand}>
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
        )}
        <IconButton
          size="xs"
          icon={<Icon icon={Icon.is('ClipboardText')} size={12} stroke={1} />}
          variant="ghost"
          intent="base"
          aria-label="Copy to Clipboard"
          onPress={handleCopy}
        />
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    position: 'relative',
    my: '$6',

    pre: {
      flex: 1,
      mb: '$0 !important',
      padding: '$3 $5 $3',
      tabSize: '4',
      fontSize: '14px !important',
      bg: 'transparent !important',
      borderRadius: '$default',
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
  wrapper: cssObj({
    borderRadius: '$default',
    background: 'var(--colors-preBg)',

    '&[data-need-expand=false]': {
      overflowY: 'auto',
      pr: '$6',
    },

    '&[data-need-expand=true]': {
      overflow: 'clip',

      '&[data-expanded=true]': {
        maxHeight: 'none',
        height: 'auto',

        '& pre': {
          overflow: 'auto',
        },
      },
      '&[data-expanded=false]::after': {
        display: 'block',
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        borderBottomLeftRadius: '$default',
        borderBottomRightRadius: '$default',
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
      },
      '&[data-expanded=false]': {
        maxHeight: '300px',
        height: '300px',
      },
    },
  }),
  actions: cssObj({
    display: 'flex',
    zIndex: '$6',
    position: 'absolute',
    bottom: '$2',
    right: '$2',
    gap: '$2',

    '& button': {
      fontSize: '$xs',
      border: '1px solid $whiteA6',

      '&, &:hover': {
        color: '$whiteA10 !important',
        bg: '$preBg !important',
      },
      '&:hover': {
        borderColor: '$whiteA9 !important',
      },
    },
  }),
};
