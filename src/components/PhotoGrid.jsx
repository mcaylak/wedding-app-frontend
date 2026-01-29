import React, { useState } from 'react';

const PhotoGrid = ({ photos = [], loading = false, onPhotoClick, isSelectionMode = false, selectedPhotos = [], onPhotoSelect }) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (photoId) => {
    setImageErrors(prev => ({ ...prev, [photoId]: true }));
  };

  const handleImageLoad = (photoId) => {
    setImageErrors(prev => ({ ...prev, [photoId]: false }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gradient-to-br from-blush-rose/20 to-champagne-gold/20 rounded-xl animate-pulse"
          >
            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-xl backdrop-blur-sm"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="text-6xl mb-6 opacity-50">📷</div>
        <h3 className="font-playfair text-2xl text-warm-gray mb-2">Henüz fotoğraf yok</h3>
        <p className="font-inter text-warm-gray/70 text-center max-w-md">
          Güzel düğün anılarınızı paylaşmaya ilk fotoğrafınızı yükleyerek başlayın!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {photos.map((photo, index) => (
        <div
          key={photo.id || index}
          className={`group relative aspect-square cursor-pointer transform transition-all duration-300 hover:scale-105 ${
            isSelectionMode && selectedPhotos.includes(photo.id) ? 'ring-4 ring-blue-500' : ''
          }`}
          onClick={() => {
            if (isSelectionMode && onPhotoSelect) {
              onPhotoSelect(photo.id);
            } else if (onPhotoClick) {
              onPhotoClick(photo);
            }
          }}
        >
          {/* Glass card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg group-hover:shadow-2xl transition-all duration-300"></div>
          
          {/* Image container */}
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            {!imageErrors[photo.id] ? (
              <img
                src={photo.url || photo.thumbnailUrl || photo.src}
                alt={photo.title || `Wedding photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => handleImageError(photo.id)}
                onLoad={() => handleImageLoad(photo.id)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blush-rose/30 to-champagne-gold/30 flex items-center justify-center">
                <div className="text-center text-warm-gray/60">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="text-sm">Image unavailable</p>
                </div>
              </div>
            )}
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-white text-sm font-inter">
                  {photo.title && (
                    <p className="truncate font-medium">{photo.title}</p>
                  )}
                  {photo.uploadDate && (
                    <p className="text-white/80 text-xs mt-1">
                      {new Date(photo.uploadDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              {/* View icon or Selection checkbox */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {isSelectionMode ? (
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedPhotos.includes(photo.id) 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-white/60 bg-white/10'
                  }`}>
                    {selectedPhotos.includes(photo.id) && <span className="text-xs">✓</span>}
                  </div>
                ) : (
                  <div className="text-white text-sm">👁️</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;