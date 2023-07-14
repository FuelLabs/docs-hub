export type CodeImportProps = {
  file: string;
  lines?: number[];
  testCase?: string;
  title?: string;
  __content: string;
  __filepath: string;
  // __filename: string;
  __language: string;
  __lineStart: number;
  __lineEnd?: number;
};

export function CodeImport({
  __content: content,
  // __filename: filename,
  __language: language,
}: CodeImportProps) {
  // const lines = `L${lineStart}${lineEnd ? `-L${lineEnd}` : ''}`;
  // const link = `${REPO_LINK}/${filePath}#${lines}`;
  return <pre className={`language-${language}`}>{content}</pre>;
}
