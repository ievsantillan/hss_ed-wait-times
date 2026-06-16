import { createRoot } from 'react-dom/client';

import App from '@/App';
import { bootstrapApp } from '@/services/bootstrap';

import './main.css';

// Initialize the Rayfin data client. The live AHS wait-times feed is fetched directly
// in the browser and does not depend on this, so a failure here (e.g. missing key in a
// preview build) must not block the public page from rendering.
try {
  bootstrapApp();
} catch (err) {
  console.error('Rayfin data client failed to initialize:', err);
}

createRoot(document.getElementById('root')!).render(<App />);
