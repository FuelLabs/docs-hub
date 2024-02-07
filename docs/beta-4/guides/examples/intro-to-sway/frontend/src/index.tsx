/* ANCHOR: fe_index_all */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FuelProvider } from '@fuel-wallet/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <FuelProvider>
    <App />
    </FuelProvider> 
  </React.StrictMode>
);
/* ANCHOR: fe_index_all */
