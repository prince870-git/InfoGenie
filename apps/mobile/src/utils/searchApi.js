import fetchToWeb from '../__create/fetch';

// Get base URL - use environment variable or fallback to current origin for web
const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_BASE_URL) {
    return process.env.EXPO_PUBLIC_BASE_URL;
  }
  // For web in development, try to detect the web server
  if (typeof window !== 'undefined' && window.location) {
    // If we're on Expo's port (8081), try to use the web server port
    if (window.location.port === '8081' || window.location.port === '19006') {
      // Try common web server ports (4000, 4001, 4002, 4003)
      // Web server typically runs on one of these ports
      // Start with 4003 as it's the most recent
      return `http://localhost:4003`;
    }
    return window.location.origin;
  }
  return '';
};

/**
 * Search API utility for InfoGenie
 */
export const searchInfoGenie = async (query, mode = 'general') => {
  try {
    const baseURL = getBaseURL();
    const url = baseURL ? `${baseURL}/api/search` : '/api/search';
    
    const response = await fetchToWeb(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query.trim(), mode }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Search API error response:', text);
      throw new Error(`Search failed: ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response received:', text.substring(0, 200));
      throw new Error('Server returned non-JSON response. Make sure the web API server is running.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

/**
 * Get search history
 */
export const getSearchHistory = async (limit = 20, offset = 0) => {
  try {
    const baseURL = getBaseURL();
    const url = baseURL 
      ? `${baseURL}/api/search-history?limit=${limit}&offset=${offset}`
      : `/api/search-history?limit=${limit}&offset=${offset}`;
    
    const response = await fetchToWeb(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search history error:', error);
    return [];
  }
};

/**
 * Save research item
 */
export const saveResearch = async (searchId, title, folder = 'General', notes = '') => {
  try {
    const baseURL = getBaseURL();
    const url = baseURL ? `${baseURL}/api/saved-research` : '/api/saved-research';
    
    const response = await fetchToWeb(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_id: searchId,
        title,
        folder,
        notes,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save research: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Save research error:', error);
    throw error;
  }
};

/**
 * Get saved research items
 */
export const getSavedResearch = async (folder = null, limit = 20, offset = 0) => {
  try {
    const baseURL = getBaseURL();
    let url = baseURL 
      ? `${baseURL}/api/saved-research?limit=${limit}&offset=${offset}`
      : `/api/saved-research?limit=${limit}&offset=${offset}`;
    if (folder) {
      url += `&folder=${encodeURIComponent(folder)}`;
    }

    const response = await fetchToWeb(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch saved research: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get saved research error:', error);
    return [];
  }
};

