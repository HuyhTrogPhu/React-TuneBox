import React from 'react';

const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };  // Make sure you are exporting the Button correctly
