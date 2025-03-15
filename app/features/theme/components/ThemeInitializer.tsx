'use client';

import {useTheme} from 'next-themes';
import {useEffect} from 'react';

export function ThemeInitializer() {
  const {setTheme} = useTheme();

  // Initialize theme based on stored preference or system preference
  useEffect(() => {
    try {
      // Get the stored theme from localStorage
      const storedTheme = localStorage.getItem('bitcoin-wallet-theme');

      // If there's a stored theme, use it
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        // Otherwise, set to system
        setTheme('system');
      }
    } catch (e) {
      console.error('Error initializing theme:', e);
    }
  }, [setTheme]);

  return null;
}
