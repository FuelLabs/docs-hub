/* eslint-disable no-console */
import { Flex, Button } from "@fuel-ui/react";
import { useState } from "react";
import { MDXRemote } from "next-mdx-remote";

import { ExampleBox } from "~/src/components/ExampleBox";

interface QueryProps {
    query: any;
    args: {};
}

export function Query(props: QueryProps) {
  const [resp, setResp] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const keys = Object.keys(props.args)

  function runQuery() {
    setLoading(true);
    fetch("https://node-beta-2.fuel.network/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  return (
    <ExampleBox>
      <Flex direction="column" gap="$4">
        <>
          <Button onPress={runQuery}>{loading ? "Loading..." : "Run"}</Button>
          
          {resp && 
          <>
          {keys.length > 0 && <>
          <div>Args:</div>
          {JSON.stringify(props.args)}
          </>
          }
          <div>Response:</div>
          <div>{JSON.stringify(resp)}</div>
          </>
          }
        </>
      </Flex>
    </ExampleBox>
  );
}
