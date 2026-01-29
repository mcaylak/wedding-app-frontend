import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import UploadPage from './pages/UploadPage'
import FaceSearchPage from './pages/FaceSearchPage'
import LoginScreen from './components/LoginScreen'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weddingId, setWeddingId] = useState('');
  const [weddingKey, setWeddingKey] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [actualWeddingId, setActualWeddingId] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [weddingDetails, setWeddingDetails] = useState(null);

  const fetchWeddingDetails = async (weddingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/wedding/${weddingId}/details`);
      if (response.ok) {
        const details = await response.json();
        setWeddingDetails(details);
      }
    } catch (error) {
      console.error('Error fetching wedding details:', error);
    }
  };

  const handleAuthenticate = async () => {
    if (!weddingId || !weddingKey) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weddingId: weddingId,
          weddingKey: weddingKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Authentication response:', data);
        setAuthToken(data.token);
        setActualWeddingId(data.weddingId);
        await fetchWeddingDetails(data.weddingId);
        setIsAuthenticated(true);
      } else {
        alert('Geçersiz düğün bilgileri');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage authToken={authToken} weddingId={actualWeddingId} weddingDetails={weddingDetails} />;
      case 'gallery':
        return <GalleryPage authToken={authToken} weddingId={actualWeddingId} />;
      case 'upload':
        return <UploadPage authToken={authToken} weddingId={actualWeddingId} />;
      case 'search':
        return <FaceSearchPage authToken={authToken} weddingId={actualWeddingId} />;
      default:
        return <HomePage authToken={authToken} weddingId={actualWeddingId} weddingDetails={weddingDetails} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        weddingId={weddingId}
        setWeddingId={setWeddingId}
        weddingKey={weddingKey}
        setWeddingKey={setWeddingKey}
        loading={loading}
        onAuthenticate={handleAuthenticate}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} weddingDetails={weddingDetails} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer weddingDetails={weddingDetails} />
    </div>
  );
}

export default App
