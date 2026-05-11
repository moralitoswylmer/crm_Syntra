import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';
import './style.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el nodo raíz para iniciar Syntra.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
