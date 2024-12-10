import * as runtimeDev from 'react/jsx-dev-runtime'; // Development.
import * as runtimeProd from 'react/jsx-runtime'; // Production.

let runtime = runtimeDev;
if (process.env.NODE_ENV === 'production') {
  // @ts-ignore
  runtime = runtimeProd;
}

export { runtime };
