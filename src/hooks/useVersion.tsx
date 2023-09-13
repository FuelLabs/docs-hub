import type { ReactNode, FC } from 'react';
import { createContext, useContext, useState } from 'react';

export type VersionCtx = 'beta-4' | 'latest';

const versionCtx = createContext<VersionCtx>('beta-4');
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
      return (sessionStorage.getItem('version') as VersionCtx) || 'beta-4';
    }
    return 'beta-4';
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
