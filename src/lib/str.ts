const PREPOSITIONS = [
  'a',
  'an',
  'the',
  'and',
  'but',
  'or',
  'for',
  'nor',
  'on',
  'at',
  'to',
  'from',
  'by',
  'of',
  'in',
  'as',
];

const specialCapsWords = [
  { word: 'fuelvm', newWord: 'FuelVM' },
  { word: 'evm', newWord: 'EVM' },
  { word: 'api', newWord: 'API' },
  { word: 'abi', newWord: 'ABI' },
  { word: 'graphql', newWord: 'graphQL' },
  { word: 'lsp', newWord: 'LSP' },
  { word: 'sdk', newWord: 'SDK' },
];

export function capitalize(val: string): string {
  if (val.length === 0) {
    return val;
  }
  const words = val.split(' ');
  const capitalizedWords = words.map((word, idx) => {
    let newWord = word;
    const isFirstWord = idx === 0;
    const isPrep = PREPOSITIONS.includes(newWord.toLowerCase());
    const isLowerCase = newWord === newWord.toLowerCase();
    if (isFirstWord || !isPrep || !isLowerCase) {
      specialCapsWords.forEach((item) => {
        if (newWord === item.word) {
          newWord = item.newWord;
        }
      });
      return newWord.charAt(0).toUpperCase() + newWord.slice(1);
    }
    return newWord;
  });
  return capitalizedWords.join(' ');
}
