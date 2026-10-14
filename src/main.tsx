import '@fontsource/mukta/400.css';
import '@fontsource/mukta/600.css';
import '@fontsource/mukta/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/noto-serif-devanagari/500.css';
import '@fontsource/noto-serif-devanagari/600.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/anek-devanagari';
import './styles.css';
import './templates/templates.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
