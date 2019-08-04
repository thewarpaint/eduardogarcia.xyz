import React from 'react';

import CurrencyList from './components/CurrencyList';
import exchangeRates from './exchangeRates.data';
import './App.css';

function App() {
  return (
    <section className="currencies">
      <h1 className="title">
        How much money do you need to be a millionaire in 🇲🇽 Mexico?
      </h1>

      <CurrencyList exchangeRates={exchangeRates} />
    </section>
  );
}

export default App;
