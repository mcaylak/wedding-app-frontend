import '../styles/LoginScreen.css';

const LoginScreen = ({ 
  weddingId, 
  setWeddingId, 
  weddingKey, 
  setWeddingKey, 
  loading, 
  onAuthenticate 
}) => {
  return (
    <div className="login-screen">
      {/* Hero Section */}
      <div className="login-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <span className="hero-icon-emoji">💒</span>
          </div>
          
          <h1 className="login-title">Wedding Gallery</h1>
          <p className="login-subtitle">
            A beautiful collection of memories from your special day. 
            Access your private wedding photo gallery with your unique credentials.
          </p>
          
          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">Secure Access</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📸</div>
              <div className="feature-text">High Quality</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💝</div>
              <div className="feature-text">Forever Memories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="login-container">
        <div className="login-header">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">Enter your wedding credentials to access your gallery</p>
        </div>
        
        <div className="login-form">
          <div className="form-group">
            <label className="form-label">Wedding ID</label>
            <input
              type="text"
              className="form-input"
              value={weddingId}
              onChange={(e) => setWeddingId(e.target.value)}
              placeholder="Enter your wedding ID"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Access Key</label>
            <input
              type="password"
              className="form-input"
              value={weddingKey}
              onChange={(e) => setWeddingKey(e.target.value)}
              placeholder="Enter your access key"
              disabled={loading}
            />
          </div>
          
          <div className="demo-buttons">
            <button 
              className="demo-button"
              onClick={() => {
                setWeddingId('550e8400-e29b-41d4-a716-446655440000');
                setWeddingKey('test123');
              }}
              disabled={loading}
            >
              Use Demo Login
            </button>
            <div className="demo-info">
              <small>Wedding ID: 550e8400-e29b-41d4-a716-446655440000 | Key: test123</small>
            </div>
          </div>

          <button 
            className={`login-button ${loading ? 'loading' : ''}`}
            onClick={onAuthenticate}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Authenticating...
              </>
            ) : (
              <>
                Access Gallery
              </>
            )}
          </button>
        </div>

        <div className="login-footer">
          <p className="footer-text">Your memories are safely protected</p>
          <div className="footer-features">
            <div className="footer-feature">
              <div className="footer-feature-icon">🛡️</div>
              <div className="footer-feature-text">Private & Secure</div>
            </div>
            <div className="footer-feature">
              <div className="footer-feature-icon">⚡</div>
              <div className="footer-feature-text">Fast Loading</div>
            </div>
            <div className="footer-feature">
              <div className="footer-feature-icon">📱</div>
              <div className="footer-feature-text">Mobile Friendly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;