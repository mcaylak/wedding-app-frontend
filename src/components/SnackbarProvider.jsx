import React, { createContext, useContext, useState, useCallback } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'info' // 'success', 'error', 'warning', 'info'
  });

  const showSnackbar = useCallback((message, type = 'info') => {
    setSnackbar({
      open: true,
      message,
      type
    });

    // Auto hide after 4 seconds
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const showSuccess = useCallback((message) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  const showError = useCallback((message) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  const showWarning = useCallback((message) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  const showInfo = useCallback((message) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  const value = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {snackbar.open && (
        <div className={`snackbar snackbar-${snackbar.type}`}>
          <span className="snackbar-message">{snackbar.message}</span>
          <button 
            className="snackbar-close" 
            onClick={hideSnackbar}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;