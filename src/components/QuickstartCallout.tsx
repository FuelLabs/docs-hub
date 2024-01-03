import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { Code } from './Code';
import { Pre } from './Pre';

export function QuickstartCallout() {
  return (
    <Box css={styles.container}>
      Want to skip the setup and just get started? Try our new scaffold CLI tool
      to generate a new Fuel project in seconds:
      <Pre>
        <Code>pnpm create-fuels my-fuel-project</Code>
      </Pre>
    </Box>
  );
}

const styles = {
  container: cssObj({
    border: '1px solid #eaeaea',
    py: '$4',
  }),
};
