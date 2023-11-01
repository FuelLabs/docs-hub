import { cssObj } from '@fuel-ui/css';
import { Box, ButtonLink } from '@fuel-ui/react';

export function Navigation({ active }: { active: string }) {
  const isGuidesActive = active.startsWith('guides');
  return (
    <Box.Flex gap={'$3'}>
      <ButtonLink
        size="sm"
        leftIcon="FileDescription"
        leftIconAriaLabel="documentation"
        intent="base"
        href={'/'}
        css={
          !isGuidesActive
            ? { ...styles.navItem, ...styles.active }
            : styles.navItem
        }
      >
        Documentation
      </ButtonLink>
      <ButtonLink
        size="sm"
        leftIcon="Book2"
        leftIconAriaLabel="documentation"
        href={'/guides'}
        intent="base"
        css={
          isGuidesActive
            ? { ...styles.navItem, ...styles.active }
            : styles.navItem
        }
      >
        Guides
      </ButtonLink>
    </Box.Flex>
  );
}

const styles = {
  navItem: cssObj({
    '&:hover': {
      'html[class="fuel_light-theme"] &': {
        color: '#009957 !important',
      },
      'html[class="fuel_dark-theme"] &': {
        color: '$semanticLinkPrimaryColor !important',
      },

      textDecoration: 'none !important',
      '.fuel_Icon': {
        color: '$semanticLinkPrimaryColor !important',
      },
    },
  }),
  active: cssObj({
    color: '$semanticLinkPrimaryColor',
    '.fuel_Icon': {
      color: '$semanticLinkPrimaryColor',
    },
  }),
};
