import { useState } from 'react';
import pb from '../pocketbase';
import './EmailCapture.css';

function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');

    try {
      await pb.collection('email_subscribers').create({
        email: email.toLowerCase().trim(),
        subscribed_at: new Date().toISOString(),
        source: 'linktree'
      });

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      // Check if email already exists
      if (error?.data?.data?.email?.code === 'validation_not_unique') {
        setStatus('success');
        setMessage('You\'re already subscribed!');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Try again.');
      }

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="email-capture">
      <p className="email-capture-title">Stay Connected</p>
      <form onSubmit={handleSubmit} className="email-capture-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="email-capture-input"
          disabled={status === 'loading'}
          aria-label="Email address"
        />
        <button
          type="submit"
          className={`email-capture-btn ${status}`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className="spinner"></span>
          ) : status === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      {message && (
        <p className={`email-capture-message ${status}`}>{message}</p>
      )}
    </div>
  );
}

export default EmailCapture;
