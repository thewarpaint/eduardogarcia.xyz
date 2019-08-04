import React from 'react';

const million = 1000000;

const CurrencyList = ({exchangeRates}) => {
  return (
    <ul className="currency-list">
      {
        exchangeRates.map(exchangeRate => {
          return (
            <li className="currency"
                key={exchangeRate.currencyCode}
                title={exchangeRate.currencyName}>
              <a href="#"
                 className="currency-link">
                {getMillionConversion(exchangeRate)} {exchangeRate.currencyCode} {exchangeRate.emojiFlag}
              </a>
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
