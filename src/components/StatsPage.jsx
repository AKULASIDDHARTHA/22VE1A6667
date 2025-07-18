import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Paper, Typography, Link, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as urlService from '../services/urlService';
import logger from '../services/logger';

const StatsPage = () => {
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    setUrls(urlService.getUrls().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by most recent
    logger.info('Stats page loaded.');
  }, []);

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">Statistics</Typography>
        <Link component={RouterLink} to="/">Back to Shortener</Link>
      </Box>
      {urls.length > 0 ? urls.map(url => (
        <Accordion key={url.shortCode}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}><Typography sx={{ wordBreak: 'break-all' }}><strong>Short URL:</strong> {`${window.location.origin}/${url.shortCode}`}</Typography></Grid>
                <Grid item xs={12} md={5}><Typography sx={{ wordBreak: 'break-all' }}><strong>Original:</strong> {url.longUrl}</Typography></Grid>
                <Grid item xs={12} md={2}><Typography><strong>Total Clicks:</strong> {url.clicks.length}</Typography></Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">Click Details</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow><TableCell>Timestamp</TableCell><TableCell>Source</TableCell><TableCell>Location</TableCell></TableRow></TableHead>
                <TableBody>
                  {url.clicks.length > 0 ? url.clicks.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                      <TableCell sx={{ wordBreak: 'break-all' }}>{click.source}</TableCell>
                      <TableCell>{click.location}</TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={3} align="center">No clicks recorded yet.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )) : <Typography align="center">No URLs have been shortened yet.</Typography>}
    </Paper>
  );
};

export default StatsPage;