import { cssObj } from '@fuel-ui/css';
import { ButtonLink } from '@fuel-ui/react';

export function Navigation({ active }: { active: string }) {
  const isGuidesActive = active.startsWith('guides');
  return (
    <>
      <ButtonLink
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
    </>
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
