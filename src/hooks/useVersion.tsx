import type { ReactNode, FC } from 'react';
import { createContext, useContext, useState } from 'react';

import { FUEL_TESTNET_UPPER_CASE } from '../config/constants';

export type VersionCtx = typeof FUEL_TESTNET_UPPER_CASE | 'Nightly';

const versionCtx = createContext<VersionCtx>(FUEL_TESTNET_UPPER_CASE);
const setVersionCtx = createContext<(value: VersionCtx) => void>(() => {});

export function useVersion() {
  return useContext(versionCtx);
}

export function useSetVersion() {
  return useContext(setVersionCtx);
}

interface VersionProviderProps {
  children: ReactNode;
}

export const VersionProvider: FC<VersionProviderProps> = ({ children }) => {
  const [state, setState] = useState<VersionCtx>(() => {
    if (typeof window !== 'undefined') {
      return (
        (sessionStorage.getItem('version') as VersionCtx) ||
        FUEL_TESTNET_UPPER_CASE
      );
    }
    return FUEL_TESTNET_UPPER_CASE;
  });

  const setVersionInSession = (version: VersionCtx) => {
    setState(version);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('version', version);
    }
  };

  return (
    <versionCtx.Provider value={state}>
      <setVersionCtx.Provider value={setVersionInSession}>
        {children}
      </setVersionCtx.Provider>
    </versionCtx.Provider>
  );
};
