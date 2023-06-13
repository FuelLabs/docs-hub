import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useDocContext } from '~/src/hooks/useDocContext';

export function DocFooter() {
  const { docLink } = useDocContext();
  const router = useRouter();
  let prevLink = docLink.prev?.slug;
  let nextLink = docLink.next?.slug;
  if (docLink.prev?.slug?.startsWith('../')) {
    prevLink = docLink.prev.slug.replace('../', '');
  }
  if (docLink.next?.slug?.startsWith('../')) {
    nextLink = docLink.next.slug.replace('../', '');
  }

  if (router.asPath === '/') nextLink = `docs/${nextLink}`;

  return (
    <Box as="footer" css={styles.root}>
      <Box css={{ flex: 1 }}>
        {docLink.prev && prevLink && (
          <Link href={prevLink}>
            <Icon icon={Icon.is('ArrowLeft')} size={24} /> {docLink.prev.label}
          </Link>
        )}
      </Box>
      <Box>
        {docLink.next && nextLink && (
          <Link href={nextLink}>
            {docLink.next.label} <Icon icon={Icon.is('ArrowRight')} size={24} />
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
      color: '$accent11',
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
