import React, {Component} from 'react';

import CurrencyList from './components/CurrencyList';
import Settings from './components/Settings';
import exchangeRates from './exchangeRates.data';
import './App.css';

const comparators = {
  countryCodeAsc: (a, b) => a.countryCode.localeCompare(b.countryCode),
  countryCodeDesc: (a, b) => b.countryCode.localeCompare(a.countryCode),
  rateAsc: (a, b) => a.rate - b.rate,
  rateDesc: (a, b) => b.rate - a.rate,
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      sortBy: 'countryCodeAsc',
    };
  }

  handleOnChange = (changeEvent) => {
    this.setState({
      sortBy: changeEvent.target.value,
    });
  };

  render() {
    return (
      <section className="currencies">
        <h1 className="title">
          How much money do you need to be a millionaire in 🇲🇽 Mexico?
        </h1>

        <Settings
          handleOnChange={this.handleOnChange}
          sortBy={this.state.sortBy}
        />

        <CurrencyList exchangeRates={getSortedExchangeRates(this.state.sortBy)} />
      </section>
    );
  }
}

function getSortedExchangeRates(comparatorKey) {
  return exchangeRates.sort(comparators[comparatorKey]);
}

export default App;
