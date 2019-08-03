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
// From https://exchange-rates.org/HistoricalRates/A/MXN/8-1-2018
let table = document.querySelectorAll('.table.table-fixed.table-exchange.table-striped.table-hover')[1];

let exchangeRates = Array.from(table.querySelectorAll('tbody tr'))
  .map((row) => {
    return {
      countryCode: row.querySelector('.text-left.convert-to .flag span').className,
      currencyCode: row.querySelector('.text-left.convert-to .code').innerText,
      currencyName: row.querySelector('.text-left.convert-to .full').innerText,
      rate: row.querySelector('.text-rate').innerText,
    };
  });
```

```json
[
  {
    "countryCode": "al",
    "currencyCode": "ALL",
    "currencyName": "Albanian Lek",
    "rate": "5.78725"
  },
  {
    "countryCode": "dz",
    "currencyCode": "DZD",
    "currencyName": "Algerian Dinar",
    "rate": "6.33790"
  },
  {
    "countryCode": "ao",
    "currencyCode": "AOA",
    "currencyName": "Angolan Kwanza",
    "rate": "13.82610"
  },
  {
    "countryCode": "ar",
    "currencyCode": "ARS",
    "currencyName": "Argentine Peso",
    "rate": "1.47948"
  },
  {
    "countryCode": "am",
    "currencyCode": "AMD",
    "currencyName": "Armenian Dram",
    "rate": "25.87673"
  },
  {
    "countryCode": "au",
    "currencyCode": "AUD",
    "currencyName": "Australian Dollar",
    "rate": "0.07265"
  },
  {
    "countryCode": "az",
    "currencyCode": "AZN",
    "currencyName": "Azerbaijani Manat",
    "rate": "0.09155"
  },
  {
    "countryCode": "bs",
    "currencyCode": "BSD",
    "currencyName": "Bahamian Dollar",
    "rate": "0.05381"
  },
  {
    "countryCode": "bh",
    "currencyCode": "BHD",
    "currencyName": "Bahraini Dinar",
    "rate": "0.02033"
  },
  {
    "countryCode": "bd",
    "currencyCode": "BDT",
    "currencyName": "Bangladeshi Taka",
    "rate": "4.54736"
  },
  {
    "countryCode": "bb",
    "currencyCode": "BBD",
    "currencyName": "Barbados Dollar",
    "rate": "0.10761"
  },
  {
    "countryCode": "by",
    "currencyCode": "BYN",
    "currencyName": "Belarusian Ruble",
    "rate": "0.10769"
  },
  {
    "countryCode": "bz",
    "currencyCode": "BZD",
    "currencyName": "Belize Dollar",
    "rate": "0.10818"
  },
  {
    "countryCode": "bm",
    "currencyCode": "BMD",
    "currencyName": "Bermudian Dollar",
    "rate": "0.05381"
  },
  {
    "countryCode": "bo",
    "currencyCode": "BOB",
    "currencyName": "Bolivian Boliviano",
    "rate": "0.37213"
  },
  {
    "countryCode": "ba",
    "currencyCode": "BAM",
    "currencyName": "Bosnia and Herzegovina Marka",
    "rate": "0.09024"
  },
  {
    "countryCode": "bw",
    "currencyCode": "BWP",
    "currencyName": "Botswana Pula",
    "rate": "0.55221"
  },
  {
    "countryCode": "br",
    "currencyCode": "BRL",
    "currencyName": "Brazilian Real",
    "rate": "0.20185"
  },
  {
    "countryCode": "gb",
    "currencyCode": "GBP",
    "currencyName": "British Pound",
    "rate": "0.04099"
  },
  {
    "countryCode": "bn",
    "currencyCode": "BND",
    "currencyName": "Brunei Dollar",
    "rate": "0.08128"
  },
  {
    "countryCode": "bg",
    "currencyCode": "BGN",
    "currencyName": "Bulgarian Lev",
    "rate": "0.09023"
  },
  {
    "countryCode": "bi",
    "currencyCode": "BIF",
    "currencyName": "Burundi Franc",
    "rate": "96.01235"
  },
  {
    "countryCode": "kh",
    "currencyCode": "KHR",
    "currencyName": "Cambodian Riel",
    "rate": "218.49291"
  },
  {
    "countryCode": "ca",
    "currencyCode": "CAD",
    "currencyName": "Canadian Dollar",
    "rate": "0.06995"
  },
  {
    "countryCode": "cv",
    "currencyCode": "CVE",
    "currencyName": "Cape Verde Escudo",
    "rate": "5.10592"
  },
  {
    "countryCode": "ky",
    "currencyCode": "KYD",
    "currencyName": "Cayman Islands Dollar",
    "rate": "0.04412"
  },
  {
    "countryCode": "N-A",
    "currencyCode": "XOF",
    "currencyName": "CFA BCEAO Franc",
    "rate": "30.26688"
  },
  {
    "countryCode": "N-A",
    "currencyCode": "XAF",
    "currencyName": "CFA BEAC Franc",
    "rate": "30.19822"
  },
  {
    "countryCode": "N-A",
    "currencyCode": "XPF",
    "currencyName": "CFP Franc",
    "rate": "5.50615"
  },
  {
    "countryCode": "cl",
    "currencyCode": "CLP",
    "currencyName": "Chilean Peso",
    "rate": "34.58502"
  },
  {
    "countryCode": "cn",
    "currencyCode": "CNY",
    "currencyName": "Chinese Yuan Renminbi",
    "rate": "0.36708"
  },
  {
    "countryCode": "co",
    "currencyCode": "COP",
    "currencyName": "Colombian Peso",
    "rate": "155.84147"
  },
  {
    "countryCode": "cr",
    "currencyCode": "CRC",
    "currencyName": "Costa Rican Colon",
    "rate": "30.52677"
  },
  {
    "countryCode": "hr",
    "currencyCode": "HRK",
    "currencyName": "Croatian Kuna",
    "rate": "0.34168"
  },
  {
    "countryCode": "cu",
    "currencyCode": "CUP",
    "currencyName": "Cuban Peso",
    "rate": "0.05382"
  },
  {
    "countryCode": "cz",
    "currencyCode": "CZK",
    "currencyName": "Czech Koruna",
    "rate": "1.18045"
  },
  {
    "countryCode": "dk",
    "currencyCode": "DKK",
    "currencyName": "Danish Krone",
    "rate": "0.34379"
  },
  {
    "countryCode": "dj",
    "currencyCode": "DJF",
    "currencyName": "Djibouti Franc",
    "rate": "9.57673"
  },
  {
    "countryCode": "do",
    "currencyCode": "DOP",
    "currencyName": "Dominican Peso",
    "rate": "2.53683"
  },
  {
    "countryCode": "N-A",
    "currencyCode": "XCD",
    "currencyName": "East Caribbean Dollar",
    "rate": "0.14541"
  },
  {
    "countryCode": "eg",
    "currencyCode": "EGP",
    "currencyName": "Egyptian Pound",
    "rate": "0.96206"
  },
  {
    "countryCode": "er",
    "currencyCode": "ERN",
    "currencyName": "Eritrean Nakfa",
    "rate": "0.80759"
  },
  {
    "countryCode": "et",
    "currencyCode": "ETB",
    "currencyName": "Ethiopian Birr",
    "rate": "1.49143"
  },
  {
    "countryCode": "eu",
    "currencyCode": "EUR",
    "currencyName": "Euro",
    "rate": "0.04613"
  },
  {
    "countryCode": "fj",
    "currencyCode": "FJD",
    "currencyName": "Fiji Dollar",
    "rate": "0.11285"
  },
  {
    "countryCode": "gm",
    "currencyCode": "GMD",
    "currencyName": "Gambian Dalasi",
    "rate": "2.59090"
  },
  {
    "countryCode": "ge",
    "currencyCode": "GEL",
    "currencyName": "Georgian Lari",
    "rate": "0.13182"
  },
  {
    "countryCode": "gh",
    "currencyCode": "GHS",
    "currencyName": "Ghanaian Cedi",
    "rate": "0.25826"
  },
  {
    "countryCode": "gt",
    "currencyCode": "GTQ",
    "currencyName": "Guatemalan Quetzal",
    "rate": "0.40367"
  },
  {
    "countryCode": "gn",
    "currencyCode": "GNF",
    "currencyName": "Guinea Franc",
    "rate": "489.17866"
  },
  {
    "countryCode": "ht",
    "currencyCode": "HTG",
    "currencyName": "Haitian Gourde",
    "rate": "3.60741"
  },
  {
    "countryCode": "hn",
    "currencyCode": "HNL",
    "currencyName": "Honduran Lempira",
    "rate": "1.29236"
  },
  {
    "countryCode": "hk",
    "currencyCode": "HKD",
    "currencyName": "Hong Kong Dollar",
    "rate": "0.42224"
  },
  {
    "countryCode": "hu",
    "currencyCode": "HUF",
    "currencyName": "Hungarian Forint",
    "rate": "14.80890"
  },
  {
    "countryCode": "is",
    "currencyCode": "ISK",
    "currencyName": "Iceland Krona",
    "rate": "5.72199"
  },
  {
    "countryCode": "in",
    "currencyCode": "INR",
    "currencyName": "Indian Rupee",
    "rate": "3.67588"
  },
  {
    "countryCode": "id",
    "currencyCode": "IDR",
    "currencyName": "Indonesian Rupiah",
    "rate": "776.92072"
  },
  {
    "countryCode": "ir",
    "currencyCode": "IRR",
    "currencyName": "Iranian Rial",
    "rate": "2371.11480"
  },
  {
    "countryCode": "iq",
    "currencyCode": "IQD",
    "currencyName": "Iraqi Dinar",
    "rate": "64.20356"
  },
  {
    "countryCode": "il",
    "currencyCode": "ILS",
    "currencyName": "Israeli New Shekel",
    "rate": "0.19774"
  },
  {
    "countryCode": "jm",
    "currencyCode": "JMD",
    "currencyName": "Jamaican Dollar",
    "rate": "7.23064"
  },
  {
    "countryCode": "jp",
    "currencyCode": "JPY",
    "currencyName": "Japanese Yen",
    "rate": "6.00902"
  },
  {
    "countryCode": "jo",
    "currencyCode": "JOD",
    "currencyName": "Jordanian Dinar",
    "rate": "0.03816"
  },
  {
    "countryCode": "kz",
    "currencyCode": "KZT",
    "currencyName": "Kazakhstan Tenge",
    "rate": "18.78115"
  },
  {
    "countryCode": "ke",
    "currencyCode": "KES",
    "currencyName": "Kenyan Shilling",
    "rate": "5.40056"
  },
  {
    "countryCode": "kr",
    "currencyCode": "KRW",
    "currencyName": "Korean Won",
    "rate": "60.22924"
  },
  {
    "countryCode": "kw",
    "currencyCode": "KWD",
    "currencyName": "Kuwaiti Dinar",
    "rate": "0.01629"
  },
  {
    "countryCode": "kg",
    "currencyCode": "KGS",
    "currencyName": "Kyrgyzstani Som",
    "rate": "3.65863"
  },
  {
    "countryCode": "la",
    "currencyCode": "LAK",
    "currencyName": "Lao Kip",
    "rate": "454.63590"
  },
  {
    "countryCode": "lb",
    "currencyCode": "LBP",
    "currencyName": "Lebanese Pound",
    "rate": "81.22222"
  },
  {
    "countryCode": "ls",
    "currencyCode": "LSL",
    "currencyName": "Lesotho Loti",
    "rate": "0.71343"
  },
  {
    "countryCode": "ly",
    "currencyCode": "LYD",
    "currencyName": "Libyan Dinar",
    "rate": "0.07398"
  },
  {
    "countryCode": "mo",
    "currencyCode": "MOP",
    "currencyName": "Macau Pataca",
    "rate": "0.43501"
  },
  {
    "countryCode": "mk",
    "currencyCode": "MKD",
    "currencyName": "Macedonia Denar",
    "rate": "2.84101"
  },
  {
    "countryCode": "mw",
    "currencyCode": "MWK",
    "currencyName": "Malawi Kwacha",
    "rate": "39.08149"
  },
  {
    "countryCode": "my",
    "currencyCode": "MYR",
    "currencyName": "Malaysian Ringgit",
    "rate": "0.21879"
  },
  {
    "countryCode": "mu",
    "currencyCode": "MUR",
    "currencyName": "Mauritius Rupee",
    "rate": "1.84769"
  },
  {
    "countryCode": "md",
    "currencyCode": "MDL",
    "currencyName": "Moldovan Leu",
    "rate": "0.89162"
  },
  {
    "countryCode": "ma",
    "currencyCode": "MAD",
    "currencyName": "Moroccan Dirham",
    "rate": "0.50887"
  },
  {
    "countryCode": "mm",
    "currencyCode": "MMK",
    "currencyName": "Myanmar Kyat",
    "rate": "78.04825"
  },
  {
    "countryCode": "na",
    "currencyCode": "NAD",
    "currencyName": "Namibian Dollar",
    "rate": "0.71155"
  },
  {
    "countryCode": "np",
    "currencyCode": "NPR",
    "currencyName": "Nepalese Rupee",
    "rate": "5.90222"
  },
  {
    "countryCode": "an",
    "currencyCode": "ANG",
    "currencyName": "Netherlands Antillian Guilder",
    "rate": "0.09631"
  },
  {
    "countryCode": "nz",
    "currencyCode": "NZD",
    "currencyName": "New Zealand Dollar",
    "rate": "0.07918"
  },
  {
    "countryCode": "ni",
    "currencyCode": "NIO",
    "currencyName": "Nicaraguan Cordoba Oro",
    "rate": "1.70662"
  },
  {
    "countryCode": "ng",
    "currencyCode": "NGN",
    "currencyName": "Nigerian Naira",
    "rate": "19.48221"
  },
  {
    "countryCode": "no",
    "currencyCode": "NOK",
    "currencyName": "Norwegian Krone",
    "rate": "0.44006"
  },
  {
    "countryCode": "om",
    "currencyCode": "OMR",
    "currencyName": "Omani Rial",
    "rate": "0.02071"
  },
  {
    "countryCode": "pk",
    "currencyCode": "PKR",
    "currencyName": "Pakistan Rupee",
    "rate": "6.65010"
  },
  {
    "countryCode": "pa",
    "currencyCode": "PAB",
    "currencyName": "Panamanian Balboa",
    "rate": "0.05382"
  },
  {
    "countryCode": "py",
    "currencyCode": "PYG",
    "currencyName": "Paraguay Guarani",
    "rate": "308.75414"
  },
  {
    "countryCode": "pe",
    "currencyCode": "PEN",
    "currencyName": "Peruvian Sol",
    "rate": "0.17589"
  },
  {
    "countryCode": "ph",
    "currencyCode": "PHP",
    "currencyName": "Philippine Peso",
    "rate": "2.85221"
  },
  {
    "countryCode": "pl",
    "currencyCode": "PLN",
    "currencyName": "Polish Zloty",
    "rate": "0.19669"
  },
  {
    "countryCode": "qa",
    "currencyCode": "QAR",
    "currencyName": "Qatari Rial",
    "rate": "0.19585"
  },
  {
    "countryCode": "ro",
    "currencyCode": "RON",
    "currencyName": "Romanian Leu",
    "rate": "0.21307"
  },
  {
    "countryCode": "ru",
    "currencyCode": "RUB",
    "currencyName": "Russian Ruble",
    "rate": "3.39225"
  },
  {
    "countryCode": "rw",
    "currencyCode": "RWF",
    "currencyName": "Rwanda Franc",
    "rate": "46.53977"
  },
  {
    "countryCode": "sa",
    "currencyCode": "SAR",
    "currencyName": "Saudi Riyal",
    "rate": "0.20177"
  },
  {
    "countryCode": "rs",
    "currencyCode": "RSD",
    "currencyName": "Serbian Dinar",
    "rate": "5.44469"
  },
  {
    "countryCode": "sc",
    "currencyCode": "SCR",
    "currencyName": "Seychelles Rupee",
    "rate": "0.73046"
  },
  {
    "countryCode": "sg",
    "currencyCode": "SGD",
    "currencyName": "Singapore Dollar",
    "rate": "0.07326"
  },
  {
    "countryCode": "so",
    "currencyCode": "SOS",
    "currencyName": "Somali Shilling",
    "rate": "31.20871"
  },
  {
    "countryCode": "za",
    "currencyCode": "ZAR",
    "currencyName": "South African Rand",
    "rate": "0.71128"
  },
  {
    "countryCode": "lk",
    "currencyCode": "LKR",
    "currencyName": "Sri Lanka Rupee",
    "rate": "8.58050"
  },
  {
    "countryCode": "sd",
    "currencyCode": "SDG",
    "currencyName": "Sudanese Pound",
    "rate": "0.97223"
  },
  {
    "countryCode": "sz",
    "currencyCode": "SZL",
    "currencyName": "Swaziland Lilangeni",
    "rate": "0.70482"
  },
  {
    "countryCode": "se",
    "currencyCode": "SEK",
    "currencyName": "Swedish Krona",
    "rate": "0.47375"
  },
  {
    "countryCode": "ch",
    "currencyCode": "CHF",
    "currencyName": "Swiss Franc",
    "rate": "0.05337"
  },
  {
    "countryCode": "sy",
    "currencyCode": "SYP",
    "currencyName": "Syrian Pound",
    "rate": "27.70874"
  },
  {
    "countryCode": "tw",
    "currencyCode": "TWD",
    "currencyName": "Taiwan Dollar",
    "rate": "1.64767"
  },
  {
    "countryCode": "tz",
    "currencyCode": "TZS",
    "currencyName": "Tanzanian Shilling",
    "rate": "122.51032"
  },
  {
    "countryCode": "th",
    "currencyCode": "THB",
    "currencyName": "Thai Baht",
    "rate": "1.78358"
  },
  {
    "countryCode": "tt",
    "currencyCode": "TTD",
    "currencyName": "Trinidad and Tobago Dollar",
    "rate": "0.36272"
  },
  {
    "countryCode": "tn",
    "currencyCode": "TND",
    "currencyName": "Tunisian Dinar",
    "rate": "0.14506"
  },
  {
    "countryCode": "tr",
    "currencyCode": "TRY",
    "currencyName": "Turkish Lira",
    "rate": "0.26925"
  },
  {
    "countryCode": "tm",
    "currencyCode": "TMT",
    "currencyName": "Turkmenistan Manat",
    "rate": "0.18831"
  },
  {
    "countryCode": "ug",
    "currencyCode": "UGX",
    "currencyName": "Uganda Shilling",
    "rate": "198.82239"
  },
  {
    "countryCode": "ua",
    "currencyCode": "UAH",
    "currencyName": "Ukraine Hryvnia",
    "rate": "1.45026"
  },
  {
    "countryCode": "ae",
    "currencyCode": "AED",
    "currencyName": "United Arab Emirates Dirham",
    "rate": "0.19758"
  },
  {
    "countryCode": "uy",
    "currencyCode": "UYU",
    "currencyName": "Uruguay Peso",
    "rate": "1.64392"
  },
  {
    "countryCode": "us",
    "currencyCode": "USD",
    "currencyName": "US Dollar",
    "rate": "0.05380"
  },
  {
    "countryCode": "uz",
    "currencyCode": "UZS",
    "currencyName": "Uzbekistan Som",
    "rate": "419.22943"
  },
  {
    "countryCode": "ve",
    "currencyCode": "VEF",
    "currencyName": "Venezuelan Bolivar",
    "rate": "9278.39123"
  },
  {
    "countryCode": "vn",
    "currencyCode": "VND",
    "currencyName": "Vietnamese Dong",
    "rate": "1253.16165"
  },
  {
    "countryCode": "ye",
    "currencyCode": "YER",
    "currencyName": "Yemeni Rial",
    "rate": "13.46672"
  },
  {
    "countryCode": "zm",
    "currencyCode": "ZMW",
    "currencyName": "Zambian Kwacha",
    "rate": "0.53728"
  }
]
```