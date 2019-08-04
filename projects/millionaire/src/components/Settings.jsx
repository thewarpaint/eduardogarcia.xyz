import React from 'react';

const Settings = ({handleOnChange, sortBy}) => {
  return (
    <form>
      <input
        id="input-radio-country-code-asc"
        type="radio"
        name="sort"
        className="input-radio"
        value="countryCodeAsc"
        checked={sortBy === 'countryCodeAsc'}
        onChange={handleOnChange}
      />
      <label
        className="label"
        htmlFor="input-radio-country-code-asc"
      >
        A → Z
      </label>

      <input
        id="input-radio-country-code-desc"
        type="radio"
        name="sort"
        className="input-radio"
        value="countryCodeDesc"
        checked={sortBy === 'countryCodeDesc'}
        onChange={handleOnChange}
      />
      <label
        className="label"
        htmlFor="input-radio-country-code-desc"
      >
        Z → A
      </label>

      <input
        id="input-radio-rate-asc"
        type="radio"
        name="sort"
        className="input-radio"
        value="rateAsc"
        checked={sortBy === 'rateAsc'}
        onChange={handleOnChange}
      />
      <label
        className="label"
        htmlFor="input-radio-rate-asc"
      >
        $1 → $9
      </label>

      <input
        id="input-radio-rate-desc"
        type="radio"
        name="sort"
        className="input-radio"
        value="rateDesc"
        checked={sortBy === 'rateDesc'}
        onChange={handleOnChange}
      />
      <label
        className="label"
        htmlFor="input-radio-rate-desc"
      >
        $9 → $1
      </label>
    </form>
  );
};

export default Settings;