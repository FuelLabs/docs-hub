import { BN } from 'fuels';

export function getConfigurables(levelKey: string) {
  let configurableConstants = undefined;
  switch (levelKey) {
    case 'vault':
      configurableConstants = {
        PASSWORD: 17,
      };
      break;
    default:
      console.log('LEVEL NOT FOUND');
      break;
  }

  return configurableConstants;
}
