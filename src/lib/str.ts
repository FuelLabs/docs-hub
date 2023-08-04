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
      if (word === 'fuelvm') {
        word = 'fuelVM';
      } else if (word === 'evm') {
        word = 'eVM';
      }
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
    str === 'forc'
  );
}
