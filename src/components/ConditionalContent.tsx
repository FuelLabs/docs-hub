import type { VersionSet } from '../types';

interface ConditionalContentProps {
  children: React.ReactNode;
  versionSet: VersionSet;
  showForVersions: VersionSet[];
}

export function ConditionalContent(props: ConditionalContentProps) {
  if (props.children && props.showForVersions.includes(props.versionSet)) {
    return <>{props.children}</>;
  }
}
