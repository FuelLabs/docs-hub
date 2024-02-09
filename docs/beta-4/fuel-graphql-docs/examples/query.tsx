import { Box, Button, Spinner } from '@fuel-ui/react';
import { useState } from 'react';
import { ExampleBox } from '~/src/components/ExampleBox';

interface QueryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;
}

export function Query(props: QueryProps) {
  const [resp, setResp] = useState();
  const [loading, setLoading] = useState(false);

  function runQuery() {
    setLoading(true);
    fetch('https://beta-4.fuel.network/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: props.query,
        variables: props.args,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setResp(result);
        setLoading(false);
      });
  }

  interface IPrettyPrintJson {
    data: string;
  }

  const PrettyPrintJson = ({ data }: IPrettyPrintJson) => {
    return (
      <div>
        <pre style={{ overflow: 'scroll', maxHeight: '500px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <ExampleBox>
      <Box.Flex direction="column" gap="$4">
        <>
          <Button intent="base" variant="outlined" onClick={runQuery}>
            {loading ? <Spinner /> : 'Run'}
          </Button>

          {resp && (
            <>
              <div>Response:</div>
              <PrettyPrintJson data={resp} />
            </>
          )}
        </>
      </Box.Flex>
    </ExampleBox>
  );
}
