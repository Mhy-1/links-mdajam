import { useEffect } from 'react';
import StarsCanvas from './StarsCanvas';
import QRCode from './QRCode';
import EmailCapture from './EmailCapture';
import ThemeSelector from './ThemeSelector';
import { useLinksData } from '../hooks/useLinksData';
import { sanitizeUrl } from '../utils/urlValidator';
import { trackClick, trackPageView } from '../utils/analytics';
import { config } from '../config';
import './Linktree.css';

function Linktree() {
  const { profile, links, loading, error } = useLinksData();

  // Track page view on mount
  useEffect(() => {
    trackPageView();
  }, []);

  // Handle link click with analytics
  const handleLinkClick = (name, url) => {
    trackClick(name, url);
  };

  // Show spinner only on fresh load with no cache
  if (loading && !profile) {
    return (
      <main className="user-profile loading-state" role="status" aria-live="polite">
        <div className="animated-background" aria-hidden="true">
          <StarsCanvas starCount={200} layers={3} />
        </div>
        <div className="loading-spinner" aria-label="Loading content"></div>
      </main>
    );
  }

  // Error with no cached data
  if (error && !profile) {
    return (
      <main className="user-profile" role="alert">
        <div className="animated-background" aria-hidden="true">
          <StarsCanvas starCount={200} layers={3} />
        </div>
        <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
          Unable to load. Please refresh the page.
        </p>
      </main>
    );
  }

  return (
    <main className="user-profile">
      <div className="animated-background" aria-hidden="true">
        <StarsCanvas starCount={200} layers={3} />
      </div>

      {/* Profile Section */}
      <section className="profile-section" aria-label="Profile Information">
        <div id="profilePicture">
          {profile?.image && (
            <img
              src={profile.image}
              alt={`${profile.name || 'User'} profile photo`}
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        <header id="userName">
          <h1 className="pname">{profile?.name}</h1>
          <p className="ppro">{profile?.profession}</p>
          <p className="bio">{profile?.bio}</p>
        </header>

        {profile?.morphTexts?.length > 0 && (
          <div className="morph-text" aria-label="Specialties">
            {profile.morphTexts.join(' | ')}
          </div>
        )}
      </section>

      {/* Links Section */}
      <nav className="social-links-container" aria-label="Social Links">
        {/* Portfolio Link */}
        <div className="social-link website-link" style={{ animationDelay: '0.4s' }}>
          <a
            href={config.portfolioUrl}
            className="social-link-anchor"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my portfolio website"
            onClick={() => handleLinkClick('Portfolio', config.portfolioUrl)}
          >
            <div className="social-icon" aria-hidden="true">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '8px' }}
              >
                <path
                  d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="social-text">View Portfolio</span>
          </a>
        </div>

        {links.map((link, index) => (
          <div
            className="social-link"
            key={link.url || link.name || index}
            style={{ animationDelay: `${(index + 1) * 0.2 + 0.4}s` }}
          >
            <a
              href={sanitizeUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-anchor"
              aria-label={`Visit ${link.name}`}
              onClick={() => handleLinkClick(link.name, link.url)}
            >
              <div className="social-icon" aria-hidden="true">
                {link.iconUrl ? (
                  <img src={link.iconUrl} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="icon-placeholder">🔗</span>
                )}
              </div>
              <span className="social-text">{link.name}</span>
            </a>
          </div>
        ))}

        {/* Email Capture Form */}
        <EmailCapture />
      </nav>

      {/* Share/QR Code Button */}
      <QRCode />

      {/* Theme Selector */}
      <ThemeSelector />
    </main>
  );
}

export default Linktree;
