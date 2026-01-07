import { useState } from 'react';
import { config } from '../config';
import './QRCode.css';

function QRCode({ url = config.publicUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate QR code URL using free API (no library needed)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=1a1a2e&color=ffffff`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mshary Dajam Links',
          text: 'Connect with Mshary Dajam',
          url: url
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch {
        // Fallback for older browsers
        setIsOpen(true);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'mshary-links-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Share Button */}
      <button
        className="qr-toggle-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Share this page"
        title="Share"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
        </svg>
      </button>

      {/* QR Code Modal */}
      {isOpen && (
        <div className="qr-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="qr-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="qr-title">Share This Page</h2>

            <div className="qr-image-container">
              <img
                src={qrCodeUrl}
                alt="QR Code for this page"
                className="qr-image"
                loading="lazy"
              />
            </div>

            <p className="qr-url">{url}</p>

            <div className="qr-actions">
              <button className="qr-btn qr-btn-primary" onClick={handleShare}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                </svg>
                Share
              </button>
              <button className="qr-btn qr-btn-secondary" onClick={handleDownload}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download QR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QRCode;
