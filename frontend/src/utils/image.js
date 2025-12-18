import { API_BASE_URL } from './constants.js';

export const resolveImageUrl = (url) => {
  if (!url) return '';

  // Already absolute (http/https/data)
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  try {
    const api = new URL(API_BASE_URL);
    const origin = api.origin; // e.g. http://localhost:5000
    if (url.startsWith('/')) {
      return origin + url;
    }
    return `${origin}/${url}`;
  } catch (e) {
    return url;
  }
};


