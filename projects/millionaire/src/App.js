import React, {Component} from 'react';

import CurrencyList from './components/CurrencyList';
import Settings from './components/Settings';
import exchangeRates from './exchangeRates.data';
import './App.css';

class App extends Component {
  render() {
    return (
      <section className="currencies">
        <h1 className="title">
          How much money do you need to be a millionaire in 🇲🇽 Mexico?
        </h1>

        <Settings />

        <CurrencyList exchangeRates={getSortedExchangeRates()} />
      </section>
    );
  }
}

function getSortedExchangeRates() {
  const comparators = {
    countryCodeAsc: (a, b) => a.countryCode.localeCompare(b.countryCode),
    countryCodeDesc: (a, b) => b.countryCode.localeCompare(a.countryCode),
    rateAsc: (a, b) => a.rate - b.rate,
    rateDesc: (a, b) => b.rate - a.rate,
  };

  return exchangeRates.sort(comparators.countryCodeAsc);
}

export default App;
