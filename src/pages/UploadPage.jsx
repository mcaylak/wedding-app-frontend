import React, { useState, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const UploadPage = ({ authToken, weddingId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const newFiles = imageFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
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
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updatedFiles;
    });
  };

  const uploadFiles = async () => {
    console.log('uploadFiles called', { 
      selectedFilesLength: selectedFiles.length, 
      authToken: !!authToken, 
      weddingId: weddingId 
    });
    
    if (selectedFiles.length === 0) {
      console.log('No files selected');
      return;
    }
    
    if (!authToken) {
      console.log('No auth token');
      return;
    }
    
    if (!weddingId) {
      console.log('No wedding ID');
      return;
    }
    
    setUploading(true);
    setOverallProgress(0);
    const results = [];
    const totalFiles = selectedFiles.length;
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const fileData = selectedFiles[i];
      
      setSelectedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' } : f)
      );
      
      setUploadProgress(prev => ({ ...prev, [fileData.id]: 0 }));
      
      try {
        const formData = new FormData();
        formData.append('file', fileData.file);
        
        const xhr = new XMLHttpRequest();
        
        await new Promise((resolve, reject) => {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              setUploadProgress(prev => ({ ...prev, [fileData.id]: percentComplete }));
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const result = JSON.parse(xhr.responseText);
              setSelectedFiles(prev => 
                prev.map(f => f.id === fileData.id ? { ...f, status: 'completed' } : f)
              );
              setUploadProgress(prev => ({ ...prev, [fileData.id]: 100 }));
              results.push({
                file: fileData.name,
                status: 'success',
                message: 'Yükleme başarılı',
                id: result.id
              });
              resolve();
            } else {
              reject(new Error('Upload failed'));
            }
          });
          
          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
          });
          
          xhr.open('POST', `${API_BASE_URL}/photos/upload/${weddingId}`);
          xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
          xhr.send(formData);
        });
      } catch (error) {
        setSelectedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'error' } : f)
        );
        
        results.push({
          file: fileData.name,
          status: 'error',
          message: error.message || 'Yükleme başarısız'
        });
      }
      
      const currentProgress = Math.round(((i + 1) / totalFiles) * 100);
      setOverallProgress(currentProgress);
    }
    
    setUploadResults(results);
    setUploading(false);
    
    const successCount = results.filter(r => r.status === 'success').length;
    const failureCount = results.filter(r => r.status === 'error').length;
    
    if (failureCount === 0) {
      setSnackbarMessage(`✅ Tüm ${successCount} fotoğraf başarıyla yüklendi!`);
      setSnackbarType('success');
    } else if (successCount === 0) {
      setSnackbarMessage(`❌ Tüm yüklemeler başarısız oldu. Lütfen tekrar deneyin.`);
      setSnackbarType('error');
    } else {
      setSnackbarMessage(`⚠️ ${successCount} yüklendi, ${failureCount} başarısız.`);
      setSnackbarType('warning');
    }
    
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 5000);
  };

  const clearAll = () => {
    selectedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    setSelectedFiles([]);
    setUploadProgress({});
    setUploadResults([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <div className="relative z-10 pt-6 pb-8">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl text-gray-800 font-light tracking-tight">
            Fotoğraf Yükle
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Güzel Düğün Anılarınızı Paylaşın
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-8">
        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50/50' 
                : 'border-gray-300 bg-white/90 hover:bg-white hover:border-indigo-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-50">📤</div>
              <h3 className="text-xl text-gray-800 mb-2 font-light">
                Fotoğraflarınızı buraya bırakın
              </h3>
              <p className="text-gray-600 mb-6">
                veya göz atmak için tıklayın (çoklu dosya desteği)
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300"
              >
                Fotoğraf Seç
              </button>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-gray-800 font-light">
                Seçilen Fotoğraflar ({selectedFiles.length})
              </h3>
              <div className="space-x-3">
                <button
                  onClick={clearAll}
                  disabled={uploading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hepsini Temizle
                </button>
                <button
                  onClick={uploadFiles}
                  disabled={uploading || selectedFiles.length === 0}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    uploading || selectedFiles.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Yükleniyor... {overallProgress}%
                    </div>
                  ) : (
                    'Hepsini Yükle'
                  )}
                </button>
              </div>
            </div>
            
            {/* Overall Progress Bar */}
            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Genel İlerleme</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                    style={{ width: `${overallProgress}%` }}
                  >
                    {overallProgress > 10 && (
                      <span className="text-white text-xs font-medium">{overallProgress}%</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFiles.map((fileData) => (
                <div key={fileData.id} className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg overflow-hidden">
                  {/* Image Preview */}
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={fileData.preview}
                      alt={fileData.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Overlay */}
                    {fileData.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">Yükleniyor...</p>
                        </div>
                      </div>
                    )}
                    
                    {fileData.status === 'completed' && (
                      <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-3xl mb-2">✓</div>
                          <p className="text-sm">Completed</p>
                        </div>
                      </div>
                    )}
                    
                    {fileData.status === 'error' && (
                      <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-3xl mb-2">✗</div>
                          <p className="text-sm">Failed</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    {fileData.status === 'pending' && (
                      <button
                        onClick={() => removeFile(fileData.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {fileData.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileData.size)}
                    </p>
                    
                    {/* Progress Bar */}
                    {fileData.status === 'uploading' && uploadProgress[fileData.id] !== undefined && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[fileData.id]}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {uploadProgress[fileData.id]}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg text-gray-800 font-light mb-4">Yükleme Sonuçları</h3>
            <div className="space-y-2">
              {uploadResults.map((result, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                  result.status === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  <div className="text-lg">
                    {result.status === 'success' ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{result.file}</p>
                    <p className="text-sm opacity-80">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {uploadResults.every(r => r.status === 'success') && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-green-600 font-medium">Tüm fotoğraflar başarıyla yüklendi! 🎉</p>
                <p className="text-sm text-gray-600 mt-1">
                  Your photos are now available in the gallery
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload Guidelines */}
        {selectedFiles.length === 0 && !uploading && (
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg text-gray-800 font-light mb-4">Yükleme Rehberi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Supported Formats</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• JPEG (.jpg, .jpeg)</li>
                  <li>• PNG (.png)</li>
                  <li>• WebP (.webp)</li>
                  <li>• Maksimum dosya boyutu: 10MB</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Tips for Best Results</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Yüksek kaliteli görüntüler kullanın</li>
                  <li>• Ensure good lighting</li>
                  <li>• Multiple photos can be selected at once</li>
                  <li>• Drag and drop supported</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Snackbar */}
      {showSnackbar && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md border transition-all duration-300 ${
          snackbarType === 'success' 
            ? 'bg-green-500/90 border-green-400 text-white' 
            : snackbarType === 'error'
            ? 'bg-red-500/90 border-red-400 text-white'
            : 'bg-yellow-500/90 border-yellow-400 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <span className="font-medium">{snackbarMessage}</span>
            <button
              onClick={() => setShowSnackbar(false)}
              className="text-white hover:text-gray-200 transition-colors duration-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;