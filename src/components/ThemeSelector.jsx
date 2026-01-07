import { useState, useEffect } from 'react';
import { themes, getStoredTheme, applyTheme } from '../themes';
import './ThemeSelector.css';

function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme);
  const [isOpen, setIsOpen] = useState(false);

  // Apply theme on mount and when changed
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector">
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
        aria-expanded={isOpen}
        title="Change Theme"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="theme-backdrop" onClick={() => setIsOpen(false)} />
          <div className="theme-dropdown" role="menu">
            <p className="theme-dropdown-title">Choose Theme</p>
            <div className="theme-options">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                  onClick={() => handleThemeChange(theme.id)}
                  role="menuitem"
                  aria-pressed={currentTheme === theme.id}
                >
                  <span
                    className="theme-preview"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors['--bg-primary']} 0%, ${theme.colors['--bg-secondary']} 100%)`,
                      border: `2px solid ${theme.colors['--accent']}`
                    }}
                  />
                  <span className="theme-name">{theme.name}</span>
                  {currentTheme === theme.id && (
                    <svg className="theme-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ThemeSelector;
