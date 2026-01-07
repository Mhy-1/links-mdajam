import pb from '../pocketbase';

// Track link click to PocketBase
export async function trackClick(linkName, linkUrl) {
  try {
    // Get basic visitor info (privacy-friendly)
    const data = {
      link_name: linkName,
      link_url: linkUrl,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      timestamp: new Date().toISOString()
    };

    // Fire and forget - don't block UI
    pb.collection('links_link_clicks').create(data).catch(() => {
      // Silently fail - analytics shouldn't break the app
    });
  } catch {
    // Silently fail
  }
}

// Batch analytics for multiple clicks (optional optimization)
const clickQueue = [];
let flushTimeout = null;

export function queueClick(linkName, linkUrl) {
  clickQueue.push({
    link_name: linkName,
    link_url: linkUrl,
    referrer: document.referrer || 'direct',
    timestamp: new Date().toISOString()
  });

  // Debounce: flush after 2 seconds of no new clicks
  clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushClickQueue, 2000);
}

async function flushClickQueue() {
  if (clickQueue.length === 0) return;

  const clicks = [...clickQueue];
  clickQueue.length = 0;

  // Send batch to PocketBase (if you have a batch endpoint)
  // For now, send individually
  for (const click of clicks) {
    try {
      await pb.collection('links_link_clicks').create(click);
    } catch {
      // Silently fail
    }
  }
}

// Track page view
export async function trackPageView() {
  try {
    const data = {
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      timestamp: new Date().toISOString()
    };

    pb.collection('links_page_views').create(data).catch(() => {});
  } catch {
    // Silently fail
  }
}
