import type { ReactNode, FC } from 'react';
import { createContext, useContext, useState } from 'react';

export type VersionCtx = 'Beta-4' | 'Latest';

const versionCtx = createContext<VersionCtx>('Beta-4');
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
      return (sessionStorage.getItem('version') as VersionCtx) || 'Beta-4';
    }
    return 'Beta-4';
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
