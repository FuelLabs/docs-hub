import { cssObj } from '@fuel-ui/css';
import { Text, Box, Icon, Link as FuelLink } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useDocContext } from '~/src/hooks/useDocContext';

import { FeedbackForm } from './FeedbackForm';

export function DocFooter() {
  const { docLink } = useDocContext();
  const prevLink = docLink.prev?.slug;
  const nextLink = docLink.next?.slug;

  return (
    <Box css={styles.root}>
      <Box.Flex justify="space-between" css={styles.feedbackContainer}>
        <FeedbackForm />
        <Box.Flex gap={'6px'}>
          <Icon icon={Icon.is('HelpCircle')} stroke={1} color="textMuted" />
          <FuelLink href="https://forum.fuel.network/" isExternal>
            Ask a question in the forum.
          </FuelLink>
        </Box.Flex>
      </Box.Flex>

      <Box.Flex justify="space-between" as="footer">
        <Box.Stack gap={'0'}>
          {docLink.prev && prevLink && (
            <>
              <Text color={'textMuted'}>Previous:</Text>
              <NextLink href={prevLink}>
                <Box.Flex gap={'$4'}>
                  <Icon icon={'ArrowLeft'} size={14} />
                  <Text>{docLink.prev.label}</Text>
                </Box.Flex>
              </NextLink>
            </>
          )}
        </Box.Stack>
        <Box.Stack gap={'0'}>
          {docLink.next && nextLink && (
            <>
              <Text color={'textMuted'}>Next:</Text>
              <NextLink href={nextLink}>
                <Box.Flex gap={'$4'}>
                  <Text>{docLink.next.label}</Text>
                  <Icon icon={'ArrowRight'} size={14} />
                </Box.Flex>
              </NextLink>
            </>
          )}
        </Box.Stack>
      </Box.Flex>
    </Box>
  );
}

const styles = {
  root: cssObj({
    fontSize: '$sm',
  }),
  feedbackContainer: cssObj({
    my: '$4',
    py: '$4',
    borderTop: '1px solid $border',
    borderBottom: '1px solid $border',
  }),
};
