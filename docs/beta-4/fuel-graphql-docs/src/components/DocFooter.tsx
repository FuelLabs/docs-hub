import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDocContext } from '~/src/hooks/useDocContext';

export function DocFooter() {
  const { docLink } = useDocContext();
  const router = useRouter();
  return (
    <Box as="footer" css={styles.root}>
      <Box css={{ flex: 1 }}>
        {docLink.prev && (
          <Link href={docLink.prev.slug!}>
            <Icon icon={'ArrowLeft'} size={24} /> {docLink.prev.label}
          </Link>
        )}
      </Box>
      <Box>
        {docLink.next && (
          <Link
            href={
              router.asPath == '/'
                ? `docs/${docLink.next.slug!}`
                : docLink.next.slug!
            }
          >
            {docLink.next.label} <Icon icon={'ArrowRight'} size={24} />
          </Link>
        )}
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    pb: '$4',
    pt: '$4',
    mt: '$6',
    display: 'flex',
    borderTop: '1px dashed $gray3',

    a: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '$4',
      color: '$gray9',
    },
    'a:hover': {
      color: '#00F58C',
    },

    '@xl': {
      pt: '$12',
      mt: '$14',
    },

    '@md': {
      a: {
        fontSize: '$xl',
      },
    },
  }),
};
