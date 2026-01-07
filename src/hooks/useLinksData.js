import { useState, useEffect, useRef } from 'react';
import pb, { getFileUrl } from '../pocketbase';
import { cache } from '../utils/cache';

export function useLinksData() {
  const [state, setState] = useState(() => {
    // Initialize from cache immediately (no flash)
    const cached = cache.get();
    if (cached) {
      // Re-filter cached links for schedule (time may have passed)
      return {
        ...cached,
        links: filterScheduledLinks(cached.links),
        loading: false
      };
    }
    return { profile: null, links: [], loading: true, error: null };
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        // Parallel fetch both collections
        const [profileRecords, linksRecords] = await Promise.all([
          pb.collection('links_profile').getFullList(),
          pb.collection('links_social_links').getFullList({
            sort: 'order',
            filter: 'is_active = true'
          })
        ]);

        const profile = profileRecords[0];

        // Map and filter links for scheduling
        const allLinks = linksRecords.map(link => ({
          name: link.name,
          url: link.url,
          iconUrl: getFileUrl(link, link.icon),
          // Include schedule fields for filtering
          scheduleStart: link.schedule_start || null,
          scheduleEnd: link.schedule_end || null
        }));

        const visibleLinks = filterScheduledLinks(allLinks);

        const data = {
          profile: profile ? {
            image: getFileUrl(profile, profile.profile_image),
            name: profile.name || '',
            profession: profile.profession || '',
            bio: profile.bio || '',
            morphTexts: parseMorphTexts(profile.morph_texts)
          } : null,
          links: visibleLinks,
          loading: false,
          error: null
        };

        // Cache all links (with schedule data) so we can re-filter later
        cache.set({
          ...data,
          links: allLinks // Store all links with schedule info
        });

        setState(data);
      } catch (error) {
        console.error('Fetch error:', error);
        // Keep cached data on error, just mark error
        setState(s => ({
          ...s,
          loading: false,
          error: s.profile ? null : error // Only show error if no cached data
        }));
      }
    };

    fetchData();
  }, []);

  return state;
}

// Filter links based on schedule_start and schedule_end
function filterScheduledLinks(links) {
  const now = new Date();

  return links.filter(link => {
    // If no schedule fields, always show
    if (!link.scheduleStart && !link.scheduleEnd) {
      return true;
    }

    // Check start date
    if (link.scheduleStart) {
      const startDate = new Date(link.scheduleStart);
      if (now < startDate) {
        return false; // Not yet visible
      }
    }

    // Check end date
    if (link.scheduleEnd) {
      const endDate = new Date(link.scheduleEnd);
      if (now > endDate) {
        return false; // Expired
      }
    }

    return true;
  });
}

function parseMorphTexts(data) {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') return data.split(' | ');
  return [];
}
