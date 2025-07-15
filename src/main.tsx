import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/auth/AuthContext.tsx'
import GalleryPage from './GalleryPage.tsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>,
)
