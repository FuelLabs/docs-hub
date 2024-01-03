import { Box } from '@fuel-ui/react';

import { Code } from './Code';
import { Pre } from './Pre';

export default function QuickstartCallout() {
  return (
    <Box>
      Want to skip the setup and just get started? Try our new scaffold CLI tool
      to generate a new Fuel project in seconds:
      <Pre>
        <Code>pnpm create-fuels my-fuel-project</Code>
      </Pre>
    </Box>
  );
}
