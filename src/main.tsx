import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './components/molecules/AuthContext'
import { EnvironmentProvider } from './components/molecules/EnvironmentContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <EnvironmentProvider>
      <App />
    </EnvironmentProvider>
  </AuthProvider>
);
