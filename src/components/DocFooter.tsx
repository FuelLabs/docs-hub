import { cssObj } from '@fuel-ui/css';
import { Text, Box, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDocContext } from '~/src/hooks/useDocContext';

import { capitalize } from '../lib/str';

function parseLink(link: string) {
  if (link.startsWith('../')) {
    link = link.replace('../', '');
  }
  return link.startsWith('guides/') ? link : `docs/${link}`;
}

export function DocFooter() {
  const { docLink, doc } = useDocContext();
  const router = useRouter();
  const prevLink = docLink.prev?.slug && parseLink(docLink.prev.slug);
  let nextLink = docLink.next?.slug && parseLink(docLink.next?.slug);

  if (router.asPath === '/') nextLink = `docs/${nextLink}`;

  return (
    <>
      <Text as="div" css={styles.feedback}>
        <Link href="https://forum.fuel.network/">
          <Icon icon={Icon.is('HelpCircle')} stroke={1} color="textMuted" />
          Questions? Give us a feedback
        </Link>
        <Link href={doc.pageLink}>
          <Icon icon={Icon.is('Edit')} stroke={1} color="textMuted" />
          Edit this page
        </Link>
      </Text>

      <Box as="footer" css={styles.links}>
        <Box.Stack>
          {docLink.prev && prevLink && (
            <>
              <Box as="span" className="label">
                Previous:
              </Box>
              <Link href={prevLink}>
                <Icon icon={Icon.is('ArrowLeft')} size={14} />{' '}
                {capitalize(docLink.prev.label)}
              </Link>
            </>
          )}
        </Box.Stack>
        <Box.Stack>
          {docLink.next && nextLink && (
            <>
              <Box as="span" className="label">
                Next:
              </Box>
              <Link href={nextLink}>
                {capitalize(docLink.next.label)}{' '}
                <Icon icon={Icon.is('ArrowRight')} size={14} />
              </Link>
            </>
          )}
        </Box.Stack>
      </Box>
    </>
  );
}

const styles = {
  links: cssObj({
    pb: '$4',
    pt: '$4',
    display: 'flex',
    fontSize: '$sm',
    justifyContent: 'space-between',

    a: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '$4',
      color: '$intentsBase9',
      lineHeight: 1,
    },
    'a:hover': {
      color: '$intentsPrimary11',
    },
    '.label': {
      fontSize: '$sm',
      color: '$textMuted',
    },
  }),
  feedback: cssObj({
    mt: '$4',
    py: '$4',
    display: 'flex',
    fontSize: '$sm',
    justifyContent: 'space-between',
    borderTop: '1px solid $border',
    borderBottom: '1px solid $border',

    'a, a:visited': {
      color: '$intentsBase9',
    },
    '& a': {
      display: 'flex',
      alignItems: 'center',
      gap: '$2',
    },
  }),
};
