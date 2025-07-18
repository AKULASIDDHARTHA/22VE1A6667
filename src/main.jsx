import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// A simple theme for the app to meet UX requirements
const AppTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // A nice blue for primary actions
    },
    background: {
      paper: '#2c3e50', // A darker paper color for contrast
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);