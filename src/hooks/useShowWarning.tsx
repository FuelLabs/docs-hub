import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export type IShowWarning = 'true' | 'false';

const showWarning = createContext<IShowWarning>('true');
const setShowWarning = createContext<(value: IShowWarning) => void>(() => {});

export function useShowWarning() {
  return useContext(showWarning);
}

export function useSetShowWarning() {
  return useContext(setShowWarning);
}

interface ShowWarningProviderProps {
  children: ReactNode;
}

export const ShowWarningProvider: FC<ShowWarningProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<IShowWarning>(() => {
    if (typeof window !== 'undefined') {
      return (
        (sessionStorage.getItem('showNightlyDocsWarning') as IShowWarning) ||
        'true'
      );
    }
    return 'true';
  });

  const setShowWarningInSession = (showWarning: IShowWarning) => {
    setState(showWarning);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('showNightlyDocsWarning', showWarning);
    }
  };

  return (
    <showWarning.Provider value={state}>
      <setShowWarning.Provider value={setShowWarningInSession}>
        {children}
      </setShowWarning.Provider>
    </showWarning.Provider>
  );
};
