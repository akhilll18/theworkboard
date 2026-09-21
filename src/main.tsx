// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { LoadingProvider } from './context/LoadingContext';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/Toast/ToastContainer';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <SearchProvider>
          <ToastProvider>
            <App />
            <ToastContainer />
          </ToastProvider>
        </SearchProvider>
      </LoadingProvider>
    </ThemeProvider>
  </React.StrictMode>
);