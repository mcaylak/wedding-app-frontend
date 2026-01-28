import { useState } from 'react';
import '../styles/GalleryScreen.css';
import Pagination from './Pagination';

const API_BASE = 'http://localhost:8080/api';

const GalleryScreen = ({ 
  photos, 
  pagination,
  loading, 
  token, 
  currentScreen, 
  setCurrentScreen, 
  loadPhotos, 
  onLogout 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date');
  const [favorites, setFavorites] = useState(new Set());

  const handleToggleFavorite = (photoId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(photoId)) {
      newFavorites.delete(photoId);
    } else {
      newFavorites.add(photoId);
    }
    setFavorites(newFavorites);
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
  return (
    <div className="gallery-screen">
      {/* Modern Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="header-brand">
            <div className="brand-logo"></div>
            <div className="brand-info">
              <h1 className="brand-title">Wedding Gallery</h1>
              <span className="brand-subtitle">Premium Collection</span>
            </div>
          </div>
          
          <nav className="header-nav">
            <button className="nav-link active">Gallery</button>
            <button 
              className="nav-link"
              onClick={() => setCurrentScreen('face-search')}
            >
              Face Search
            </button>
            <button className="nav-link">Favorites</button>
          </nav>
          
          <div className="header-actions">
            <button 
              className="action-btn primary"
              onClick={() => setCurrentScreen('upload')}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Upload
            </button>
            <button className="action-btn secondary" onClick={onLogout}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m9 21 5-6-5-6" />
                <path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{pagination.totalElements}</div>
            <div className="stat-label">Photos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">2024</div>
            <div className="stat-label">Wedding Year</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">HD</div>
            <div className="stat-label">Quality</div>
          </div>
        </div>
      </div>

      <div className="gallery-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading your photos...</p>
          </div>
        ) : (
          <main className="gallery-main">
            {photos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-illustration">
                  <svg viewBox="0 0 120 120" className="empty-icon">
                    <rect x="20" y="30" width="80" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="35" cy="45" r="4" fill="currentColor"/>
                    <path d="M25 75 L40 60 L55 75 L75 55 L95 75" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <h3 className="empty-title">Your gallery is waiting</h3>
                <p className="empty-subtitle">Start building your collection by uploading beautiful wedding photos</p>
                <button 
                  className="empty-cta"
                  onClick={() => setCurrentScreen('upload')}
                >
                  Upload First Photo
                </button>
              </div>
            ) : (
              <>
                <div className="gallery-header">
                  <div className="gallery-title">
                    <h2>Wedding Collection</h2>
                    <p>Curated moments from your special day</p>
                  </div>
                  <div className="gallery-controls">
                    <div className="view-toggle">
                      <button 
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="3" width="7" height="7"/>
                          <rect x="14" y="3" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/>
                        </svg>
                        Grid
                      </button>
                      <button 
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="8" y1="6" x2="21" y2="6"/>
                          <line x1="8" y1="12" x2="21" y2="12"/>
                          <line x1="8" y1="18" x2="21" y2="18"/>
                          <line x1="3" y1="6" x2="3.01" y2="6"/>
                          <line x1="3" y1="12" x2="3.01" y2="12"/>
                          <line x1="3" y1="18" x2="3.01" y2="18"/>
                        </svg>
                        List
                      </button>
                    </div>
                    <div className="sort-controls">
                      <select 
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Date Added</option>
                        <option value="name">File Name</option>
                        <option value="size">File Size</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className={`photos-${viewMode}`}>
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="photo-card" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="photo-wrapper">
                        <img 
                          src={`${API_BASE}/photos/download/${photo.id}?token=${token}`}
                          className="photo-image"
                          alt={photo.fileName}
                          loading="lazy"
                        />
                        <div className="photo-overlay">
                          <div className="overlay-actions">
                            <button 
                              className="overlay-btn"
                              onClick={() => handleViewFull(photo)}
                              title="View Full Size"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M15 3h6v6"/>
                                <path d="M21 3l-7 7"/>
                                <path d="M9 21H3v-6"/>
                                <path d="M3 21l7-7"/>
                              </svg>
                            </button>
                            <button 
                              className="overlay-btn"
                              onClick={() => handleDownload(photo)}
                              title="Download"
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                              </svg>
                            </button>
                            <button 
                              className={`overlay-btn favorite ${favorites.has(photo.id) ? 'active' : ''}`}
                              onClick={() => handleToggleFavorite(photo.id)}
                              title={favorites.has(photo.id) ? "Remove from Favorites" : "Add to Favorites"}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polygon points="12,2 15,8 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,8"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="photo-meta">
                        <div className="meta-info">
                          <h4 className="photo-title">{photo.fileName.replace(/\.[^/.]+$/, "")}</h4>
                          <span className="photo-details">
                            {new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {pagination.totalPages > 1 && (
                  <Pagination 
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalElements={pagination.totalElements}
                    size={pagination.size}
                    onPageChange={(page) => loadPhotos(null, page, pagination.size)}
                    loading={loading}
                  />
                )}
              </>
            )}
          </main>
        )}

        {/* Simple Footer */}
        <footer className="gallery-footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-brand">
                <h3>Wedding Gallery</h3>
                <p>Beautiful memories, beautifully preserved</p>
              </div>
              <div className="footer-links">
                <a href="#about">About</a>
                <a href="#help">Help</a>
                <a href="#privacy">Privacy</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 Wedding Gallery. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GalleryScreen;