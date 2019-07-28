# How much money do you need to be a millionaire in Mexico?

## 1'000,000.00 MXN =

🇺🇸 52,662.00 USD

🇪🇺 46,786.88 EUR

🇬🇧 42,091.50 GBP

🇯🇵 5,691,500.00 JPY

🇮🇳 3,611,660.90 INR

🇨🇳 362,095.72 CNY

🇷🇺 3,301,940.24 RUB

🇦🇷 2,237,062.46 ARS

🇧🇷 197,020.00 BRL

🇨🇭 51,814.00 CHF

🇨🇦 68,350.00 CAD

🇦🇺 74,634.66 AUD

```js
Array.from(table.querySelectorAll('tbody tr'))
  .map((row) => {
    return {
      countryCode: row.querySelector('.text-left.convert-to .flag span').className,
      currencyCode: row.querySelector('.text-left.convert-to .code').innerText,
      currencyName: row.querySelector('.text-left.convert-to .full').innerText,
      rate: row.querySelector('.text-rate').innerText,
    };
  });
```