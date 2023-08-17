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
];

export function capitalize(val: string): string {
  if (val.length === 0) {
    return val;
  }
  const words = val.split(' ');
  const capitalizedWords = words.map((word, idx) => {
    const isFirstWord = idx === 0;
    const isPrep = PREPOSITIONS.includes(word.toLowerCase());
    const isLowerCase = word === word.toLowerCase();
    if (isFirstWord || !isPrep || !isLowerCase) {
      specialCapsWords.forEach((item) => {
        if (word === item.word) {
          word = item.newWord;
        }
      });
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });
  return capitalizedWords.join(' ');
}

export function isStringInTabs(str: string): boolean {
  return (
    str === 'home' ||
    str === 'guides' ||
    str === 'sway' ||
    str === 'fuels-rs' ||
    str === 'fuels-ts' ||
    str === 'wallet' ||
    str === 'graphql' ||
    str === 'fuelup' ||
    str === 'indexer' ||
    str === 'specs' ||
    // str === 'about-fuel' ||
    str === 'forc'
  );
}
