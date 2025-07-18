import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Grid, IconButton, Alert, Link, Collapse } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import * as urlService from '../services/urlService';
import logger from '../services/logger';

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const URLShortenerPage = () => {
  const [urlEntries, setUrlEntries] = useState([{ id: 1, longUrl: '', customCode: '', validity: 30 }]);
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);
  
  const handleEntryChange = (id, field, value) => setUrlEntries(urlEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
  const addEntry = () => urlEntries.length < 5 && setUrlEntries([...urlEntries, { id: Date.now(), longUrl: '', customCode: '', validity: 30 }]);
  const removeEntry = (id) => urlEntries.length > 1 && setUrlEntries(urlEntries.filter(e => e.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    let currentErrors = [];
    let newResults = [];
    setErrors([]);
    setResults([]);

    urlEntries.forEach((entry, index) => {
      if (!entry.longUrl || !URL_REGEX.test(entry.longUrl)) {
        currentErrors.push(`Row ${index + 1}: Please enter a valid URL.`);
        return;
      }
      try {
        urlService.addUrl(entry.longUrl, entry.customCode, entry.validity);
        newResults.push({ original: entry.longUrl });
      } catch (error) {
        logger.error(`Error shortening URL at row ${index + 1}:`, error.message);
        currentErrors.push(`Row ${index + 1}: ${error.message}`);
      }
    });

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
    } else {
        logger.info('All provided URLs were shortened successfully.');
        setResults(newResults);
        setUrlEntries([{ id: 1, longUrl: '', customCode: '', validity: 30 }]); // Reset form
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">URL Shortener</Typography>
      <Box textAlign="center" mb={3}>
        <Link component={RouterLink} to="/stats" variant="h6">View URL Statistics</Link>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} direction="column">
          {urlEntries.map((entry, index) => (
            <Grid item key={entry.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 <Typography sx={{ mr: 1, fontWeight: 'bold' }}>{index + 1}.</Typography>
                 <TextField fullWidth label="Original Long URL *" variant="outlined" value={entry.longUrl} onChange={e => handleEntryChange(entry.id, 'longUrl', e.target.value)} />
                 <TextField label="Custom Code" variant="outlined" value={entry.customCode} onChange={e => handleEntryChange(entry.id, 'customCode', e.target.value)} />
                 <TextField label="Validity (mins)" type="number" value={entry.validity} onChange={e => handleEntryChange(entry.id, 'validity', e.target.value)} sx={{ width: '150px' }} />
                 <IconButton onClick={() => removeEntry(entry.id)} disabled={urlEntries.length === 1} color="warning"><RemoveCircleOutlineIcon /></IconButton>
              </Box>
            </Grid>
          ))}
          <Grid item><Button startIcon={<AddCircleOutlineIcon />} onClick={addEntry} disabled={urlEntries.length >= 5}>Add URL</Button></Grid>
          <Grid item><Button type="submit" variant="contained" size="large" fullWidth>Shorten URLs</Button></Grid>
        </Grid>
      </form>
      <Collapse in={errors.length > 0}><Alert severity="error" sx={{ mt: 2 }}><ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul></Alert></Collapse>
      <Collapse in={results.length > 0}><Alert severity="success" sx={{ mt: 2 }}>URLs were successfully created! Check the statistics page for details.</Alert></Collapse>
    </Paper>
  );
};

export default URLShortenerPage;