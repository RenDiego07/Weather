import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import 'leaflet/dist/leaflet.css'; // Importa el CSS de Leaflet aquí
import './index.css'; // Tu CSS personalizado


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
