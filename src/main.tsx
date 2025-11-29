
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "leaflet/dist/leaflet.css";
import { AssistantProvider } from './contexts/AssistantContext.ts';
// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
<AssistantProvider>
   <App />
</AssistantProvider>
