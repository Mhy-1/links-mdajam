import { useState, useEffect } from 'react';
import StarsCanvas from './StarsCanvas';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './Linktree.css';

function Linktree() {
  const [profileImage, setProfileImage] = useState('');
  const [userName, setUserName] = useState('');
  const [profession, setProfession] = useState('');
  const [bio, setBio] = useState('');
  const [morphTexts, setMorphTexts] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDetailsRef = doc(db, 'profile', 'userDetails');
    const unsubscribe = onSnapshot(userDetailsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfileImage(data.profileImage || '');
        setUserName(data.name || '');
        setProfession(data.profession || '');
        setBio(data.bio || '');
        setMorphTexts(data.morphTexts ? data.morphTexts.split(' | ') : []);
        setSocialLinks(data.socialLinks || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="user-profile loading-state">
        <div className="animated-background">
          <StarsCanvas starCount={200} layers={3} />
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="animated-background">
        <StarsCanvas starCount={200} layers={3} />
      </div>

      <div id="profilePicture">
        {profileImage && (
          <img
            src={profileImage}
            alt={`${userName || 'Profile'} photo`}
            loading="eager"
            decoding="async"
          />
        )}
      </div>

      <div id="userName">
        <p className="pname">{userName}</p>
        <p className="ppro">{profession}</p>
        <p className="bio">{bio}</p>
      </div>

      <div className="morph-text">
        {morphTexts.join(' | ')}
      </div>

      <div className="social-links-container">
        {/* Portfolio Link */}
        <div className="social-link website-link" style={{ animationDelay: '0.4s' }}>
          <a
            href="https://msharydajam.dev"
            className="social-link-anchor"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="social-icon">
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
            <div className="social-text">View Portfolio</div>
          </a>
        </div>

        {socialLinks.map((link, index) => (
          <div
            className="social-link"
            key={link.url || link.name || index}
            style={{ animationDelay: `${(index + 1) * 0.2 + 0.4}s` }}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-anchor"
            >
              <div className="social-icon">
                <img src={link.iconUrl} alt={link.name} loading="lazy" decoding="async" />
              </div>
              <div className="social-text">{link.name}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Linktree;
