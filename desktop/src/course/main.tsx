import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '../renderer/brand/fonts/fonts.css';
import '../renderer/brand/instrumenta-icons.css';
import './styles/app.css';
// Lesson diagram colours: the mesh kit's classes, shared with desktop/scripts/diagram-sheet.mjs.
import '../../../content/diagrams/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
