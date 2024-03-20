import { cssObj } from '@fuel-ui/css';
import { Box, Button, ButtonLink, Grid, Text } from '@fuel-ui/react';
import NextLink from 'next/link';
import { useDocContext } from '~/src/hooks/useDocContext';

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
  const { doc } = useDocContext();

  return (
    <Box css={styles.root} as="footer">
      <PrevAndNextLinks />

      {!doc.pageLink.includes('docs/beta-4') && (
        <Box.Flex justify={'flex-end'} css={styles.feedbackContainer}>
          <ButtonLink
            leftIcon={'BrandGithubFilled'}
            size={'sm'}
            css={styles.githubLink}
            href={doc.pageLink}
            isExternal
          >
            Edit this page
          </ButtonLink>
        </Box.Flex>
      )}
    </Box>
  );
}

const styles = {
  root: cssObj({
    fontSize: '$xs',
    '@sm': {
      fontSize: '$sm',
    },
    my: '$20',
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
      '&:visited, &:active, &:hover': {
        textDecoration: 'none !important',
      },
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
  githubLink: cssObj({
    border: '1px solid $border',
    px: '$2',
    color: '$textColor',
    '&:hover': {
      textDecoration: 'none',
      bg: '$border !important',
      color: '$textColor !important',
      '.fuel_Icon': {
        color: '$textColor !important',
      },
    },
    'html[class="fuel_light-theme"] &': {
      color: 'black',
      '&:hover': {
        color: 'black !important',
        '.fuel_Icon': {
          color: 'black',
        },
      },
    },
    '.fuel_Icon': {
      color: '$textColor',
    },
  }),
  feedbackContainer: cssObj({
    mt: '$1',
    py: '$4',
    gap: '$4',
    flexDirection: 'column',
    '@sm': {
      flexDirection: 'row',
    },
  }),
};
