import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

export interface ThemeTransitionInfo {
  active: boolean;
  origin: { x: number; y: number };
  toTheme: Theme;
  timestamp: number;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent | { clientX: number; clientY: number }) => void;
  setTheme: (theme: Theme, e?: React.MouseEvent | { clientX: number; clientY: number }) => void;
  transitionInfo: ThemeTransitionInfo | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('phishguard_theme') as Theme;
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  const [transitionInfo, setTransitionInfo] = useState<ThemeTransitionInfo | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('phishguard_theme', theme);
  }, [theme]);

  const executeThemeTransition = (
    nextTheme: Theme,
    e?: React.MouseEvent | { clientX: number; clientY: number }
  ) => {
    let x = window.innerWidth / 2;
    let y = 40;

    if (e && 'clientX' in e && e.clientX !== 0) {
      x = e.clientX;
      y = e.clientY;
    } else if (e && 'currentTarget' in e && (e.currentTarget as HTMLElement)?.getBoundingClientRect) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Trigger visual telemetry HUD and shockwave
    setTransitionInfo({
      active: true,
      origin: { x, y },
      toTheme: nextTheme,
      timestamp: Date.now(),
    });

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = window.setTimeout(() => {
      setTransitionInfo((curr) => (curr ? { ...curr, active: false } : null));
    }, 1500);

    const root = document.documentElement;
    root.classList.add('theme-transitioning');

    // Check if View Transition API is supported and motion is not reduced
    const isViewTransitionSupported =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isViewTransitionSupported) {
      const transition = (document as unknown as { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
        flushSync(() => {
          setThemeState(nextTheme);
          if (nextTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
          } else {
            root.classList.add('light');
            root.classList.remove('dark');
          }
        });
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 620,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {
        // Fallback gracefully
        setThemeState(nextTheme);
      });
    } else {
      // Fallback for browsers without View Transitions API
      setThemeState(nextTheme);
      if (nextTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }

    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 650);
  };

  const toggleTheme = (e?: React.MouseEvent | { clientX: number; clientY: number }) => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    executeThemeTransition(nextTheme, e);
  };

  const setTheme = (t: Theme, e?: React.MouseEvent | { clientX: number; clientY: number }) => {
    executeThemeTransition(t, e);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, transitionInfo }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
