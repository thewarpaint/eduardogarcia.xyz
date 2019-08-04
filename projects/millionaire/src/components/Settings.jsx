import React from 'react';

const Settings = () => {
  return (
    <form>
      <input
        id="input-radio-country-code-asc"
        type="radio"
        name="sort"
        className="input-radio"
        value="countryCodeAsc"
      />
      <label
        className="label"
        for="input-radio-country-code-asc"
      >
        A → Z
      </label>

      <input
        id="input-radio-country-code-desc"
        type="radio"
        name="sort"
        className="input-radio"
        value="countryCodeDesc"
      />
      <label
        className="label"
        for="input-radio-country-code-desc"
      >
        Z → A
      </label>

      <input
        id="input-radio-rate-asc"
        type="radio"
        name="sort"
        className="input-radio"
        value="rateAsc"
      />
      <label
        className="label"
        for="input-radio-rate-asc"
      >
        $1 → $9
      </label>

      <input
        id="input-radio-rate-desc"
        type="radio"
        name="sort"
        className="input-radio"
        value="rateDesc"
      />
      <label
        className="label"
        for="input-radio-rate-desc"
      >
        $9 → $1
      </label>
    </form>
  );
};

export default Settings;