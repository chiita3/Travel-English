import React from 'react';
import { Country } from '../types';
import { COUNTRIES } from '../constants';

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onSelectCountry }) => {
  return (
    <div className="relative">
      <select
        value={selectedCountry}
        onChange={(e) => onSelectCountry(e.target.value as Country)}
        className="appearance-none bg-white border border-slate-300 rounded-md py-2 pl-3 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
      >
        {COUNTRIES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default CountrySelector;