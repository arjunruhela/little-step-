import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input 
        className={`px-3 py-2 bg-white border rounded-lg outline-none transition-all 
          ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'} 
          ${className}`} 
        {...props} 
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
