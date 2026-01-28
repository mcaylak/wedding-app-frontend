import { useRef } from 'react';
import '../styles/UploadScreen.css';

const UploadScreen = ({ uploadProgress, onUpload, setCurrentScreen }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onUpload(files[0]);
    }
  };

  return (
    <div className="upload-screen">
      <div className="upload-header">
        <button 
          className="back-button"
          onClick={() => setCurrentScreen('gallery')}
        >
          ← Back to Gallery
        </button>
        <h1 className="header-title">Upload Photos</h1>
        <div className="spacer" />
      </div>

      <div className="upload-container">
        <div 
          className={`upload-card ${uploadProgress ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="upload-icon-container">
            <span className="upload-main-icon">📸</span>
          </div>
          
          <h2 className="upload-title">Share Your Memories</h2>
          <p className="upload-subtitle">
            Add beautiful photos from your special day to the wedding gallery
          </p>
          
          <div className="upload-actions">
            <button 
              className={`upload-button ${uploadProgress ? 'disabled' : ''}`}
              onClick={handleFileSelect}
              disabled={uploadProgress}
            >
              {uploadProgress ? (
                <>
                  <div className="spinner"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span className="upload-button-icon">📸</span>
                  <span>Choose Photos</span>
                </>
              )}
            </button>

            <div className="drag-drop-text">
              or drag and drop files here
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div className="upload-tips">
            <h3 className="tip-title">💡 Tips</h3>
            <div className="tip-item">
              <span className="tip-dot">•</span>
              <span className="tip-text">Choose well-lit photos for best quality</span>
            </div>
            <div className="tip-item">
              <span className="tip-dot">•</span>
              <span className="tip-text">Photos are automatically optimized</span>
            </div>
            <div className="tip-item">
              <span className="tip-dot">•</span>
              <span className="tip-text">Supported formats: JPG, PNG, GIF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;