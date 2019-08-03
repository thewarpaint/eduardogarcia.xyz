import React from 'react';

const million = 1000000;

const CurrencyList = ({exchangeRates}) => {
  return (
    <ul className="options">
      {
        exchangeRates.map(exchangeRate => {
          return (
            <li title={exchangeRate.currencyName}>
              {getMillionConversion(exchangeRate)} {exchangeRate.currencyCode}
            </li>
          );
        })
      }
    </ul>
  );
};

function getMillionConversion(exchangeRate) {
  return (exchangeRate.rate * million).toFixed(2);
}

export default CurrencyList;