import logger from './logger';

const STORAGE_KEY = 'shortenedUrls';

const getUrls = () => {
  const urls = localStorage.getItem(STORAGE_KEY);
  return urls ? JSON.parse(urls) : [];
};

const saveUrls = (urls) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
};

const generateShortCode = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Add a new URL entry
export const addUrl = (longUrl, customCode = '', validity = 30) => {
  const urls = getUrls();
  let shortCode = customCode.trim();

  if (shortCode && urls.some(url => url.shortCode === shortCode)) {
    logger.warn(`Custom shortcode "${shortCode}" already exists. Throwing error.`);
    // As per new error handling requirements, we throw an error for the UI to catch.
    throw new Error(`Shortcode "${shortCode}" is already taken.`);
  }

  if (!shortCode) {
    do {
      shortCode = generateShortCode();
    } while (urls.some(url => url.shortCode === shortCode));
  }
  
  const newUrl = {
    longUrl,
    shortCode,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + validity * 60 * 1000).toISOString(),
    clicks: [], // Initialize as an empty array for detailed click data
  };

  const updatedUrls = [...urls, newUrl];
  saveUrls(updatedUrls);
  logger.info(`URL shortened: ${shortCode}`, newUrl);
  return updatedUrls;
};

// Record a detailed click
export const recordClick = (shortCode, clickData) => {
    let urls = getUrls();
    const urlIndex = urls.findIndex(url => url.shortCode === shortCode);
    
    if(urlIndex !== -1) {
        urls[urlIndex].clicks.push(clickData);
        saveUrls(urls);
        logger.info(`Detailed click recorded for ${shortCode}`, clickData);
    }
};

export const findUrlByShortCode = (shortCode) => {
  const foundUrl = getUrls().find(url => url.shortCode === shortCode);
  if (foundUrl && new Date(foundUrl.expiresAt) < new Date()) {
      logger.warn(`Shortcode "${shortCode}" has expired.`);
      return null; // Return null if expired
  }
  return foundUrl;
};

// Export getUrls to be used in components
export { getUrls };