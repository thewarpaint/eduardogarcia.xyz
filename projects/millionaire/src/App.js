import React from 'react';

import CurrencyList from './components/CurrencyList';
import exchangeRates from './exchangeRates.data';
import './App.css';

function App() {
  return (
    <>
      <h1 class="title">
        How much money do you need to be a millionaire in 🇲🇽 Mexico?
      </h1>

      <CurrencyList exchangeRates={exchangeRates} />
    </>
  );
}

export default App;
