import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as urlService from '../services/urlService';
import logger from '../services/logger';

const RedirectHandler = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    const handleRedirect = async () => {
      const url = urlService.findUrlByShortCode(shortCode);
      if (!url) {
        logger.error(`Redirect failed: shortcode "${shortCode}" not found or expired.`);
        // You can optionally render a "Not Found" component here
        window.location.href = '/'; // Or redirect to home
        return;
      }

      // 1. Fetch coarse-grained location from a free Geo-IP API
      let location = 'Unknown';
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        location = `${data.city}, ${data.country_name}`;
      } catch (error) {
        logger.warn('Could not fetch geolocation data.', error);
      }

      // 2. Get the click source (referrer)
      const source = document.referrer || 'Direct';

      // 3. Assemble detailed click data
      const clickData = {
        timestamp: new Date().toISOString(),
        source,
        location,
      };

      // 4. Record the detailed click
      urlService.recordClick(shortCode, clickData);

      // 5. Perform the redirection
      logger.info(`Redirecting ${shortCode} to ${url.longUrl}`);
      window.location.replace(url.longUrl);
    };

    handleRedirect();
  }, [shortCode]);

  // Render a simple loading message while processing
  return <Typography variant="h5" align="center" sx={{ mt: 10 }}>Redirecting...</Typography>;
};

export default RedirectHandler;