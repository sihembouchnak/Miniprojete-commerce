import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // default to dark
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all group"
      title={darkMode ? "Switch to Light" : "Switch to Dark"}
    >
      {darkMode ? (
        <SunIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      ) : (
        <MoonIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;

