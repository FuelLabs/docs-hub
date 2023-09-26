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
        css={!isGuidesActive && styles.active}
      >
        Documentation
      </ButtonLink>
      <ButtonLink
        leftIcon="Book2"
        leftIconAriaLabel="documentation"
        href={'/guides'}
        intent="base"
        css={isGuidesActive && styles.active}
      >
        Guides
      </ButtonLink>
    </>
  );
}

const styles = {
  active: cssObj({
    color: '$green11',
    '.fuel_Icon': {
      color: '$green11',
    },
  }),
};
