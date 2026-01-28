import { useState, useRef, useEffect } from 'react';
import '../styles/FaceSearchScreen.css';
import Pagination from './Pagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const FaceSearchScreen = ({ 
  token, 
  currentScreen, 
  setCurrentScreen, 
  onLogout 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 12, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchPhase, setSearchPhase] = useState('');
  const [faceStats, setFaceStats] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Lütfen geçerli bir resim dosyası seçin (JPEG, PNG, WebP)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert('Dosya boyutu çok büyük. Lütfen 10MB\'dan küçük bir dosya seçin.');
        return;
      }

      setSelectedImage(file);
      setSearchResults([]);
      
      // Show preview with smooth animation
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!selectedImage) {
      alert('Lütfen önce bir referans fotoğraf seçin');
      return;
    }
    
    console.log('Face search started');
    console.log('Wedding ID:', localStorage.getItem('weddingId'));
    console.log('Token:', token);

    setLoading(true);
    setProgress(0);
    setSearchPhase('Fotoğraf analiz ediliyor...');
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + Math.random() * 15;
          return prev;
        });
      }, 200);

      setProgress(20);
      setSearchPhase('DeepFace modeli başlatılıyor...');
      
      const formData = new FormData();
      formData.append('reference_image', selectedImage);
      formData.append('page', pagination.page);
      formData.append('size', pagination.size);

      setProgress(40);
      setSearchPhase('Yüz özellikleri çıkarılıyor...');
      
      const response = await fetch(`${API_BASE}/face/search/${localStorage.getItem('weddingId')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      setProgress(80);
      setSearchPhase('Sonuçlar filtreleniyor...');
      
      if (response.ok) {
        const data = await response.json();
        setProgress(95);
        setSearchPhase('Tamamlanıyor...');
        
        setTimeout(() => {
          setSearchResults(data.content || []);
          setPagination({
            page: data.page,
            size: data.size,
            totalElements: data.totalElements
          });
          setProgress(100);
          clearInterval(progressInterval);
          setLoading(false);
        }, 500);
      } else {
        clearInterval(progressInterval);
        throw new Error('Arama işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Face search error:', error);
      alert('Yüz arama işlemi başarısız oldu: ' + error.message);
      setLoading(false);
      setProgress(0);
      setSearchPhase('');
    }
  };


  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = `${API_BASE}/photos/download/${photo.id}?token=${token}`;
    link.download = photo.fileName || `photo-${photo.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFull = (photo) => {
    window.open(`${API_BASE}/photos/download/${photo.id}?token=${token}`, '_blank');
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    handleSearch();
  };

  return (
    <div className="face-search-screen">
      {/* Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="header-brand">
            <div className="brand-logo"></div>
            <div className="brand-info">
              <h1>Yüz Tanıma Arama</h1>
              <p>Fotoğraflarınızı yüze göre filtreleyin</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="nav-button secondary"
              onClick={() => setCurrentScreen('gallery')}
            >
              ← Galeriye Dön
            </button>
            <button 
              className="nav-button secondary"
              onClick={onLogout}
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <div className="face-search-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-icon">
              <div className="icon-background">
                <svg className="face-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H11V19H9V17H11V15H9V13H11V11H13V13H15V15H13V17H15V19H13V21H15V23H19C20.1 23 21 22.1 21 21V9ZM7 5V7H5V5H7ZM9 9V11H7V9H9ZM11 13V15H9V13H11Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <h1 className="hero-title">Yüz Tanıma ile Fotoğraf Ara</h1>
            <p className="hero-subtitle">Referans fotoğraf yükleyerek benzer yüzleri kolayca bulun</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-card">
            <div className="search-header">
              <h3>Referans Fotoğraf</h3>
              <p>Aramak istediğiniz kişinin net bir fotoğrafını seçin</p>
            </div>
            
            <div className={`upload-area ${selectedImage ? 'has-image' : ''}`} onClick={() => fileInputRef.current?.click()}>
              <div className="upload-content">
                {imagePreview ? (
                  <div className="preview-container">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="image-preview"
                    />
                    <div className="preview-overlay">
                      <div className="preview-actions">
                        <span className="change-icon">🔄</span>
                        <span>Değiştirmek için tıklayın</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">
                      <svg className="upload-svg" viewBox="0 0 24 24" fill="none">
                        <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                    <div className="upload-text">
                      <h4>Referans Fotoğrafı Yükleyin</h4>
                      <p>Aramak istediğiniz kişinin net bir fotoğrafını seçin</p>
                      <span className="upload-hint">JPEG, PNG, WebP formatları desteklenir</span>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedImage && (
                <div className="file-info">
                  <div className="file-details">
                    <span className="file-name">{selectedImage.name}</span>
                    <span className="file-size">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />

            {loading && (
              <div className="progress-section">
                <div className="progress-info">
                  <div className="progress-header">
                    <h4>🎯 Yüz Tanıma İşleniyor</h4>
                    <span className="progress-percentage">{Math.round(progress)}%</span>
                  </div>
                  <p className="progress-phase">{searchPhase}</p>
                </div>
                
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <div className="progress-glow"></div>
                  </div>
                </div>
                
                <div className="progress-steps">
                  <div className={`step ${progress >= 25 ? 'completed' : progress >= 0 ? 'active' : ''}`}>
                    <span className="step-icon">📷</span>
                    <span>Analiz</span>
                  </div>
                  <div className={`step ${progress >= 50 ? 'completed' : progress >= 25 ? 'active' : ''}`}>
                    <span className="step-icon">🧠</span>
                    <span>AI İşleme</span>
                  </div>
                  <div className={`step ${progress >= 75 ? 'completed' : progress >= 50 ? 'active' : ''}`}>
                    <span className="step-icon">🔍</span>
                    <span>Arama</span>
                  </div>
                  <div className={`step ${progress >= 100 ? 'completed' : progress >= 75 ? 'active' : ''}`}>
                    <span className="step-icon">✨</span>
                    <span>Tamamlandı</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="search-controls">
              <button
                className={`search-button ${loading ? 'loading' : ''}`}
                onClick={handleSearch}
                disabled={!selectedImage || loading}
              >
                {loading ? (
                  <div className="button-loading">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>İşleniyor...</span>
                  </div>
                ) : (
                  <div className="button-content">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Yüz Tanıma Başlat</span>
                  </div>
                )}
              </button>
              
              {selectedImage && !loading && (
                <button 
                  className="clear-button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setSearchResults([]);
                    fileInputRef.current.value = '';
                  }}
                >
                  <svg className="clear-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Temizle
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Arama Sonuçları</h2>
              <p>{pagination.totalElements} fotoğraf bulundu</p>
            </div>

            <div className="photos-grid">
              {searchResults.map((photo) => (
                <div key={photo.id} className="photo-card">
                  <div className="photo-container">
                    <img
                      src={`${API_BASE}/photos/download/${photo.id}?token=${token}`}
                      alt={photo.fileName}
                      className="photo-image"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                    <div className="photo-overlay">
                      <div className="photo-actions">
                        <button
                          className="action-button view"
                          onClick={() => handleViewFull(photo)}
                          title="Tam boyutta görüntüle"
                        >
                          👁️
                        </button>
                        <button
                          className="action-button download"
                          onClick={() => handleDownload(photo)}
                          title="İndir"
                        >
                          📥
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="photo-info">
                    <p className="photo-name">{photo.fileName}</p>
                    <p className="photo-date">{new Date(photo.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.totalElements / pagination.size)}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && searchResults.length === 0 && selectedImage && (
          <div className="empty-state">
            <div className="empty-content">
              <span className="empty-icon">🔍</span>
              <h3>Sonuç bulunamadı</h3>
              <p>Bu fotoğrafta bulunan yüz ile eşleşen fotoğraf bulunamadı.</p>
              <p>Benzerlik eşiğini düşürmeyi deneyin veya farklı bir fotoğraf kullanın.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceSearchScreen;