import { useEffect } from 'react';
import StarsCanvas from './StarsCanvas';
import QRCode from './QRCode';
import EmailCapture from './EmailCapture';
import ThemeSelector from './ThemeSelector';
import { useLinksData } from '../hooks/useLinksData';
import { sanitizeUrl } from '../utils/urlValidator';
import { trackClick, trackPageView } from '../utils/analytics';
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
