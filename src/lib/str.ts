export function capitalize(val: string): string {
  if (val.length === 0) {
    return val;
  }
  const words = val.split(' ');
  const capitalizedWords = words.map((word, idx) => {
    if (word.length <= 3 && idx > 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(' ');
}
