import { capitalize } from './str.mjs';

export function editLabel(label, shouldBeLowerCase) {
  let newLabel = label
    .replaceAll(/[_-]/g, ' ')
    .replace(/(b|B)eta (\d+)/, (_, p1, p2) => `${p1}eta-${p2}`);
  if (!shouldBeLowerCase) {
    newLabel = capitalize(newLabel);
  }
  return newLabel;
}
