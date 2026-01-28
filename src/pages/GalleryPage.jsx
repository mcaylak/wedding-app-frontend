import React, { useState } from 'react';
import PhotoGrid from '../components/PhotoGrid';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const GalleryPage = ({ onBackToHome, authToken, weddingId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  React.useEffect(() => {
    const fetchPhotos = async () => {
      if (!authToken || !weddingId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/photos/${weddingId}?page=0&size=50`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const formattedPhotos = data.content.map(photo => ({
            id: photo.id,
            url: `${API_BASE_URL}/photos/download/${photo.id}?token=${authToken}`,
            title: photo.fileName,
            uploadDate: photo.createdAt,
            contentType: photo.contentType
          }));
          setPhotos(formattedPhotos);
        } else {
          console.error('Failed to fetch photos');
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, [authToken, weddingId]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handlePrevPhoto = () => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    setSelectedPhoto(photos[prevIndex]);
  };

  const handleNextPhoto = () => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    setSelectedPhoto(photos[nextIndex]);
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/photos/${weddingId}/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove photo from local state
        setPhotos(photos.filter(photo => photo.id !== photoId));
        setSelectedPhoto(null); // Close modal
        alert('Photo deleted successfully');
      } else {
        alert('Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] relative overflow-hidden bg-gray-50">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(102,126,234,0.1)"/><circle cx="75" cy="75" r="1.5" fill="rgba(118,75,162,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(102,126,234,0.1)"/><circle cx="10" cy="60" r="1" fill="rgba(118,75,162,0.05)"/><circle cx="90" cy="30" r="0.8" fill="rgba(102,126,234,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-white/30 to-indigo-100/50"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-6">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl text-gray-800 font-light tracking-tight">
            Wedding Gallery
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Our Beautiful Memories
          </p>
        </div>
      </div>


      {/* Main Content */}
      <div className="relative z-10">
        <PhotoGrid 
          photos={photos}
          loading={loading}
          onPhotoClick={handlePhotoClick}
        />
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full mx-4">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              ✕
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleDeletePhoto(selectedPhoto.id); }}
              className="absolute top-4 right-20 z-10 w-12 h-12 bg-red-500/20 backdrop-blur-md border border-red-300/20 rounded-full flex items-center justify-center text-red-200 hover:bg-red-500/40 transition-all duration-300"
              title="Delete photo"
            >
              🗑️
            </button>

            {/* Navigation buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              ←
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
            >
              →
            </button>

            {/* Image */}
            <div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Image info */}
              {(selectedPhoto.title || selectedPhoto.uploadDate) && (
                <div className="p-6 bg-gradient-to-r from-white/10 to-white/5">
                  {selectedPhoto.title && (
                    <h3 className="font-playfair text-xl text-white mb-2">
                      {selectedPhoto.title}
                    </h3>
                  )}
                  {selectedPhoto.uploadDate && (
                    <p className="font-inter text-white/80 text-sm">
                      {new Date(selectedPhoto.uploadDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;