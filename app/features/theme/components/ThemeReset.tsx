'use client';

import {useEffect} from 'react';

export function ThemeReset() {
  // This effect runs once on the client side to reset any theme classes
  useEffect(() => {
    // Function to clean up theme attributes on the HTML element only
    const cleanupTheme = () => {
      const html = document.documentElement;

      // Remove all classes from the HTML element
      html.removeAttribute('class');

      // Remove style attribute completely
      html.removeAttribute('style');

      // Remove data attributes related to theme
      html.removeAttribute('data-theme');
      html.removeAttribute('data-color-scheme');
    };

    // Run immediately
    cleanupTheme();

    // Also run after a small delay to catch any late changes
    const timer = setTimeout(cleanupTheme, 0);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
