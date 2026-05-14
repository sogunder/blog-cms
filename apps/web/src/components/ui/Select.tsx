import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-bold text-gray-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent 
            rounded-2xl text-gray-900 font-semibold transition-all duration-200
            appearance-none cursor-pointer
            focus:bg-white focus:border-google-blue focus:ring-4 focus:ring-google-blue/5
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-google-red focus:border-google-red focus:ring-google-red/5' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs font-bold text-google-red ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
