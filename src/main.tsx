import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './utils/pwaUtils';

registerServiceWorker();


createRoot(document.getElementById("root")!).render(<App />);
