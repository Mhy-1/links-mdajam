// Theme definitions
export const themes = {
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      '--bg-primary': '#1a1a2e',
      '--bg-secondary': '#16213e',
      '--text-primary': '#ffffff',
      '--text-secondary': '#a0a0a0',
      '--accent': '#ffffff',
      '--card-bg': 'rgba(255, 255, 255, 0.1)',
      '--card-border': 'rgba(255, 255, 255, 0.2)',
      '--card-hover': 'rgba(255, 255, 255, 0.15)',
    }
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    colors: {
      '--bg-primary': '#0f0f23',
      '--bg-secondary': '#1a1a3e',
      '--text-primary': '#e0e0ff',
      '--text-secondary': '#8888aa',
      '--accent': '#6366f1',
      '--card-bg': 'rgba(99, 102, 241, 0.1)',
      '--card-border': 'rgba(99, 102, 241, 0.3)',
      '--card-hover': 'rgba(99, 102, 241, 0.2)',
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      '--bg-primary': '#1a2e1a',
      '--bg-secondary': '#0f1f0f',
      '--text-primary': '#e0ffe0',
      '--text-secondary': '#88aa88',
      '--accent': '#22c55e',
      '--card-bg': 'rgba(34, 197, 94, 0.1)',
      '--card-border': 'rgba(34, 197, 94, 0.3)',
      '--card-hover': 'rgba(34, 197, 94, 0.2)',
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      '--bg-primary': '#2e1a1a',
      '--bg-secondary': '#3d1f1f',
      '--text-primary': '#ffe0e0',
      '--text-secondary': '#aa8888',
      '--accent': '#f97316',
      '--card-bg': 'rgba(249, 115, 22, 0.1)',
      '--card-border': 'rgba(249, 115, 22, 0.3)',
      '--card-hover': 'rgba(249, 115, 22, 0.2)',
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      '--bg-primary': '#0a1628',
      '--bg-secondary': '#0f2942',
      '--text-primary': '#e0f4ff',
      '--text-secondary': '#88b4cc',
      '--accent': '#06b6d4',
      '--card-bg': 'rgba(6, 182, 212, 0.1)',
      '--card-border': 'rgba(6, 182, 212, 0.3)',
      '--card-hover': 'rgba(6, 182, 212, 0.2)',
    }
  },
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      '--bg-primary': '#f5f5f5',
      '--bg-secondary': '#e8e8e8',
      '--text-primary': '#1a1a2e',
      '--text-secondary': '#666666',
      '--accent': '#1a1a2e',
      '--card-bg': 'rgba(26, 26, 46, 0.08)',
      '--card-border': 'rgba(26, 26, 46, 0.2)',
      '--card-hover': 'rgba(26, 26, 46, 0.12)',
    }
  }
};

export const defaultTheme = 'dark';

// Get stored theme or default
export function getStoredTheme() {
  try {
    const stored = localStorage.getItem('linktree_theme');
    return stored && themes[stored] ? stored : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

// Store theme preference
export function storeTheme(themeId) {
  try {
    localStorage.setItem('linktree_theme', themeId);
  } catch {
    // Ignore storage errors
  }
}

// Apply theme to document
export function applyTheme(themeId) {
  const theme = themes[themeId] || themes[defaultTheme];
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Store preference
  storeTheme(themeId);
}
