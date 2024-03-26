import { Box } from '@fuel-ui/react';
import { useAccount } from '@fuel-wallet/react';
import { useEffect, useState } from 'react';
import { LEVELS_CONFIG } from '~/src/config/fuelnautLevels';
import type { FuelnautAbi } from '~/src/fuelnaut-api';
import type { Option, Vec } from '~/src/fuelnaut-api/contracts/common';
import { getLevelStatuses } from '~/src/lib/fuelnaut/fuelnaut-utils';
import { FuelnautCard } from './FuelnautCard';

interface ShowLevelsProps {
  contract: FuelnautAbi | null;
}

export default function ShowLevels({ contract }: ShowLevelsProps) {
  const [statuses, setStatuses] = useState<Vec<Option<boolean>>>();
  const { account } = useAccount();

  useEffect(() => {
    async function getStatuses() {
      if (!contract || !account) {
        console.log('Not connected to wallet');
        return 'error';
      }
      const statusesResponse = await getLevelStatuses(
        contract,
        account as `fuel${string}`,
      );
      if (statusesResponse !== null) {
        setStatuses(statusesResponse);
      }
    }
    getStatuses();
  }, [contract, account]);

  return (
    <Box.Flex gap={'$2'} wrap={'wrap'}>
      {Object.keys(LEVELS_CONFIG).map((key, index) => (
        <FuelnautCard
          title={LEVELS_CONFIG[key].title}
          status={statuses && statuses.length > index ? statuses[index] : null}
          key={key + index}
          link={`/guides/fuelnaut/${LEVELS_CONFIG[key].key}`}
        />
      ))}
    </Box.Flex>
  );
}
