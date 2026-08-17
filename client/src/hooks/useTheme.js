import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, default to 'dark'
    const savedTheme = localStorage.getItem('aegisguard-theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
    // Save to localStorage
    localStorage.setItem('aegisguard-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
