import React, { useState, useRef } from 'react';
import PhotoGrid from '../components/PhotoGrid';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const FaceSearchPage = ({ authToken, weddingId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file,
          url: e.target.result,
          name: file.name
        });
        performFaceSearch(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const performFaceSearch = async (file) => {
    console.log('Face search called', { 
      authToken: !!authToken, 
      weddingId: weddingId,
      fileName: file.name 
    });
    
    if (!authToken || !weddingId) {
      alert('Authentication required for face search');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('reference_image', file);
      formData.append('page', '0');
      formData.append('size', '12');
      
      console.log('Sending face search request to backend...');
      const response = await fetch(`${API_BASE_URL}/face/search/${weddingId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });
      
      console.log('Face search response:', response.status, response.statusText);
      
      if (response.ok) {
        const results = await response.json();
        console.log('Face search results:', results);
        
        if (results.content && results.content.length > 0) {
          const formattedResults = results.content.map((photo) => ({
            id: photo.id,
            url: `${API_BASE_URL}/photos/download/${photo.id}?token=${authToken}`,
            title: photo.fileName || `Photo ${photo.id}`,
            confidence: 0.85 // Default confidence since backend doesn't return it
          }));
          setSearchResults(formattedResults);
        } else {
          setSearchResults([]);
        }
      } else {
        const errorText = await response.text();
        console.error('Face search failed:', response.status, response.statusText, errorText);
        setSearchResults([]);
        alert(`Face search failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Face search error:', error);
      setSearchResults([]);
      alert(`Connection error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleNewSearch = () => {
    setSelectedImage(null);
    setSearchResults([]);
    setLoading(false);
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
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl text-gray-800 font-light tracking-tight">
            Face Search
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Find Yourself in Our Photos
          </p>
        </div>
        
        {selectedImage && (
          <div className="text-center">
            <button
              onClick={handleNewSearch}
              className="px-6 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              New Search
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {!selectedImage ? (
          /* Upload Area */
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl text-gray-800 mb-4 font-light">
                Upload a photo to find similar faces
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Use AI-powered face recognition to discover all photos containing the same person. 
                Simply upload a clear photo of someone's face to get started.
              </p>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragActive 
                  ? 'border-rose-gold bg-rose-gold/10' 
                  : 'border-warm-gray/30 bg-white/5 hover:bg-white/10 hover:border-rose-gold/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="font-playfair text-xl text-warm-gray mb-2">
                  Drop your photo here
                </h3>
                <p className="font-inter text-warm-gray/70 mb-6">
                  or click to browse
                </p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Choose File
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {/* Selected Image */}
            <div className="mb-8">
              <h2 className="font-playfair text-2xl text-warm-gray mb-4 text-center">
                Searching for this face:
              </h2>
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
                  <img 
                    src={selectedImage.url} 
                    alt="Selected for search"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-warm-gray">
                  <div className="w-5 h-5 border-2 border-rose-gold border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-inter">Searching faces...</span>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!loading && searchResults.length > 0 && (
              <div>
                <div className="mb-6">
                  <h3 className="font-playfair text-xl text-warm-gray text-center">
                    Found {searchResults.length} matching photos
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <div className="aspect-square bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Confidence Badge */}
                        <div className="absolute top-3 right-3 px-3 py-1 bg-rose-gold/80 backdrop-blur-sm text-white text-xs font-inter rounded-full">
                          {Math.round(photo.confidence * 100)}% match
                        </div>
                        
                        {/* Photo Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <p className="text-white font-inter text-sm">
                            {photo.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && searchResults.length === 0 && selectedImage && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 opacity-50">😔</div>
                <h3 className="font-playfair text-xl text-warm-gray mb-2">
                  No matches found
                </h3>
                <p className="font-inter text-warm-gray/70 mb-6">
                  We couldn't find any photos with this face. Try uploading a different photo.
                </p>
                <button
                  onClick={handleNewSearch}
                  className="px-6 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Try Another Photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceSearchPage;