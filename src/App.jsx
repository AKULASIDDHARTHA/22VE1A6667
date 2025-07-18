import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import URLShortenerPage from './components/URLShortenerPage';
import RedirectHandler from './components/RedirectHandler';
import StatsPage from './components/StatsPage';

function App() {
  return (
    <Router>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Routes>
          <Route path="/" element={<URLShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;