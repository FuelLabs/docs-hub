import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny:
export function Blockquote(props: any) {
  return (
    <Box.Flex as='blockquote' css={styles.root} gap={'$2'}>
      <Icon icon={'InfoCircle'} size={30} color={'intentsWarning8'} />
      {props.children}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    position: 'relative',
    my: '$6',
    mx: '$0',
    py: '$3',
    px: '$2',
    background: '$intentsWarning1',
    border: '2px solid $intentsWarning8',
    borderRadius: '4px',
    color: '$intentsBase9',
    fontStyle: 'italic',

    '& > p': {
      margin: '$0',
    },
    '.fuel_Icon': {
      alignItems: 'flex-start',
    },
  }),
};
