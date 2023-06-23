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
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });
  return capitalizedWords.join(' ');
}
