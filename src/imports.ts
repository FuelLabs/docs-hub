/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import dynamic from 'next/dynamic';

import type { DocType } from './types';

export function getComponents(doc: DocType) {
  const components: any = {};

  // load the components used in the wallet docs
  if (doc.docsConfig.slug === 'wallet') {
    const CodeImport = dynamic(
      () => import('~/src/components/CodeImport').then((mod) => mod.CodeImport),
      { ssr: false },
    );
    components.CodeImport = CodeImport;

    if (doc.slug.includes('how-to-use')) {
      const Demo = dynamic(
        () =>
          import('~/docs/fuels-wallet/packages/docs/src/components/Demo').then(
            (mod) => mod.Demo,
          ),
        { ssr: false },
      );
      components.Demo = Demo;
    } else if (doc.slug.includes('/install')) {
      const Player = dynamic(
        () => import('~/docs/fuels-wallet/packages/docs/src/components/Player'),
        { ssr: false },
      );
      components.Player = Player;

      const DownloadFuelWallet = dynamic(
        () =>
          import(
            '~/docs/fuels-wallet/packages/docs/src/components/DownloadFuelWallet'
          ).then((mod) => mod.DownloadFuelWallet),
        { ssr: false },
      );
      components.DownloadFuelWallet = DownloadFuelWallet;
    } else {
      const Examples: any = { Events: {} };
      if (doc.slug.includes('getting-started')) {
        Examples.FuelLoaded = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.FuelLoaded,
            ),
          { ssr: false },
        );

        const ConnectionAlert = dynamic(
          () =>
            import(
              '~/docs/fuels-wallet/packages/docs/src/components/ConnectionAlert'
            ).then((mod) => mod.ConnectionAlert),
          { ssr: false },
        );
        components.ConnectionAlert = ConnectionAlert;
      } else if (doc.slug.includes('connecting')) {
        Examples.Connect = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Connect,
            ),
          { ssr: false },
        );

        Examples.Events.Connection = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Events.Connection,
            ),
          { ssr: false },
        );

        Examples.IsConnected = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.IsConnected,
            ),
          { ssr: false },
        );
      } else if (doc.slug.includes('assets')) {
        Examples.AddAssets = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.AddAssets,
            ),
          { ssr: false },
        );

        Examples.Events.Assets = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Events.Assets,
            ),
          { ssr: false },
        );

        Examples.ListAssets = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.ListAssets,
            ),
          { ssr: false },
        );
        Examples.Transfer = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Transfer,
            ),
          { ssr: false },
        );
      } else if (doc.slug.includes('accounts')) {
        Examples.CurrentAccount = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.CurrentAccount,
            ),
          { ssr: false },
        );

        Examples.Events.CurrentAccount = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Events.CurrentAccount,
            ),
          { ssr: false },
        );

        Examples.ListAccounts = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.ListAccounts,
            ),
          { ssr: false },
        );
        Examples.Events.Accounts = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Events.Accounts,
            ),
          { ssr: false },
        );
      } else if (doc.slug.includes('network')) {
        Examples.Network = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Network,
            ),
          { ssr: false },
        );

        Examples.Events.Network = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Events.Network,
            ),
          { ssr: false },
        );
      } else if (doc.slug.includes('signing')) {
        Examples.SignMessage = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.SignMessage,
            ),
          { ssr: false },
        );
      } else if (doc.slug.includes('connectors')) {
        Examples.Connectors = dynamic(
          () =>
            import('~/docs/fuels-wallet/packages/docs/examples/').then(
              (mod) => mod.Connectors,
            ),
          { ssr: false },
        );
      }

      components.Examples = Examples;
    }
  } else if (
    doc.docsConfig.slug === 'graphql' &&
    doc.slug.includes('recipes')
  ) {
    const CodeExamples = dynamic(
      () =>
        import('~/src/components/GraphqlCodeExample').then(
          (mod) => mod.GraphQLCodeExample,
        ),
      { ssr: false },
    );
    components.CodeExamples = CodeExamples;

    const GQLExamples: any = {};
    GQLExamples.Balance = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then((mod) => mod.Balance),
      { ssr: false },
    );
    GQLExamples.Balances = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then((mod) => mod.Balances),
      { ssr: false },
    );
    GQLExamples.BlockByHeight = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then(
          (mod) => mod.BlockByHeight,
        ),
      { ssr: false },
    );
    GQLExamples.ContractBalance = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then(
          (mod) => mod.ContractBalance,
        ),
      { ssr: false },
    );
    GQLExamples.ContractBalances = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then(
          (mod) => mod.ContractBalances,
        ),
      { ssr: false },
    );
    GQLExamples.LatestBlocks = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then(
          (mod) => mod.LatestBlocks,
        ),
      { ssr: false },
    );
    GQLExamples.LatestTransactions = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then(
          (mod) => mod.LatestTransactions,
        ),
      { ssr: false },
    );
    GQLExamples.MessageInfo = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then(
          (mod) => mod.MessageInfo,
        ),
      { ssr: false },
    );
    GQLExamples.Transactions = dynamic(
      () =>
        import('~/docs/fuel-graphql-docs/examples').then(
          (mod) => mod.Transactions,
        ),
      { ssr: false },
    );
    components.GQLExamples = GQLExamples;
  }

  return components;
}
