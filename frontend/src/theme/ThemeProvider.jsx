import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';

const ThemeProvider = ({ children }) => {
  return (
    <>
      {children}
      <ThemeToggle />
    </>
  );
};

export default ThemeProvider;

