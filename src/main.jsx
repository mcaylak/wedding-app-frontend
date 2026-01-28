import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/snackbar.css'
import App from './App.jsx'
import AdminApp from './AdminApp.jsx'
import SnackbarProvider from './components/SnackbarProvider.jsx'

// Check if we're accessing the admin panel
const isAdminRoute = window.location.pathname === '/admin' || window.location.search.includes('admin=true');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider>
      {isAdminRoute ? <AdminApp /> : <App />}
    </SnackbarProvider>
  </StrictMode>,
)
