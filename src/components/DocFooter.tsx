import { cssObj } from '@fuel-ui/css';
import { Text, Link, Box, Icon } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useDocContext } from '~/src/hooks/useDocContext';

import { capitalize } from '../lib/str';

function parseLink(link?: string) {
  if (!link) return;
  if (link.startsWith('../')) {
    link = link.replace('../', '');
  }
  link = `/docs/${link}`;
  return link;
}

export function DocFooter() {
  const { docLink, doc } = useDocContext();
  const router = useRouter();
  const prevLink = parseLink(docLink.prev?.slug);
  let nextLink = parseLink(docLink.next?.slug);

  if (router.asPath === '/') nextLink = `docs/${nextLink}`;

  return (
    <>
      <Text as="div" css={styles.feedback}>
        <Link href="https://github.com/fuellabs/fuels-wallet/issues/new/choose">
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
      fontSize: '$xs',
      color: '$textMuted',
    },
  }),
  feedback: cssObj({
    mt: '$4',
    py: '$4',
    display: 'flex',
    fontSize: '$xs',
    justifyContent: 'space-between',
    borderTop: '1px solid $border',
    borderBottom: '1px solid $border',

    'a, a:visited': {
      color: '$intentsBase9',
    },
  }),
};
