import { cssObj } from '@fuel-ui/css';
import {
  Text,
  Box,
  Icon,
  Link as FuelLink,
  Button,
  Grid,
} from '@fuel-ui/react';
import NextLink from 'next/link';
import { useDocContext } from '~/src/hooks/useDocContext';

import { FeedbackForm } from './FeedbackForm';

export function PrevAndNextLinks() {
  const { docLink } = useDocContext();
  const prevLink = docLink.prev?.slug;
  const nextLink = docLink.next?.slug;
  const ICON_SIZE = 24;

  return (
    <Grid templateColumns={'calc(50% - 8px) calc(50% - 8px)'} gap={'$4'}>
      <Box.Stack css={styles.linkContainer} gap={'0'}>
        {docLink.prev && prevLink && (
          <NextLink href={prevLink}>
            <Button
              css={styles.linkButton}
              leftIcon={'ArrowLeft'}
              variant="outlined"
              intent="base"
              iconSize={ICON_SIZE}
            >
              <Box.VStack css={{ ...styles.links, ...styles.alignRight }}>
                <Text>PREVIOUS</Text>
                <Text css={styles.label}>{docLink.prev.label}</Text>
              </Box.VStack>
            </Button>
          </NextLink>
        )}
      </Box.Stack>
      <Box.Stack css={styles.linkContainer} gap={'0'}>
        {docLink.next && nextLink && (
          <NextLink href={nextLink}>
            <Button
              css={styles.linkButton}
              rightIcon={'ArrowRight'}
              variant="outlined"
              intent="base"
              iconSize={ICON_SIZE}
            >
              <Box.VStack css={{ ...styles.links, ...styles.alignLeft }}>
                <Text>NEXT</Text>
                <Text css={styles.label}>{docLink.next.label}</Text>
              </Box.VStack>
            </Button>
          </NextLink>
        )}
      </Box.Stack>
    </Grid>
  );
}

export function DocFooter() {
  return (
    <Box css={styles.root} as="footer">
      <Box.Flex css={styles.feedbackContainer}>
        <FeedbackForm />
        <Box.Flex gap={'6px'} css={styles.forum}>
          <Icon icon={'HelpCircle'} stroke={1} color="intentsBase12" />
          <FuelLink
            css={styles.forumLink}
            href="https://forum.fuel.network/"
            isExternal
          >
            Ask a question in the forum.
          </FuelLink>
        </Box.Flex>
      </Box.Flex>
      <PrevAndNextLinks />
    </Box>
  );
}

const styles = {
  root: cssObj({
    fontSize: '$xs',
    '@sm': {
      fontSize: '$sm',
    },
    mb: '$20',
    pb: '$10',
  }),
  linkButton: cssObj({
    width: '100%',
    height: '100%',
    py: '$4',
    '&:hover': {
      backgroundImage:
        'linear-gradient($transparent, rgb(15, 15, 15)) !important',
      'html[class="fuel_light-theme"] &': {
        backgroundImage:
          'linear-gradient($transparent, rgb(245, 245, 245)) !important',
      },
    },
  }),
  linkContainer: cssObj({
    width: '100%',
    height: '100%',
    a: {
      height: '100%',
    },
  }),
  links: cssObj({
    width: '100%',
  }),
  alignLeft: cssObj({
    textAlign: 'left',
  }),
  alignRight: cssObj({
    textAlign: 'right',
  }),
  label: cssObj({
    color: '$textInverse',
  }),
  feedbackContainer: cssObj({
    my: '$4',
    py: '$4',
    gap: '$4',
    borderTop: '1px solid $border',
    borderBottom: '1px solid $border',
    flexDirection: 'column',
    '@sm': {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  }),
  forumLink: cssObj({
    color: '$intentsBase11 !important',
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12 !important',
    },
  }),
  forum: cssObj({
    justifyContent: 'center',
    '@sm': {
      justifyContent: 'flex-start',
    },
  }),
};
