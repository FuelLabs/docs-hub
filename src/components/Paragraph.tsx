import { cssObj } from '@fuel-ui/css';
import { Text } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny:
export function Paragraph(props: any) {
  return <Text as='p' {...props} css={styles.root} />;
}

const styles = {
  root: cssObj({
    mt: '$3',
    mb: '$3',
    fontSize: '16px',
    lineHeight: '1.7',
    wordWrap: 'break-word',
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12',
    },
  }),
};
