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
          
          <h1 className="login-title">Düğün Galerisi</h1>
          <p className="login-subtitle">
            Özel gününüzden güzel anıların koleksiyonu. 
            Benzersiz bilgilerinizle özel düğün fotoğraf galerinize erişin.
          </p>
          
          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">Güvenli Erişim</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📸</div>
              <div className="feature-text">Yüksek Kalite</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💝</div>
              <div className="feature-text">Sonsuz Anılar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="login-container">
        <div className="login-header">
          <h2 className="form-title">Hoş Geldiniz</h2>
          <p className="form-subtitle">Galerinize erişmek için düğün bilgilerinizi girin</p>
        </div>
        
        <div className="login-form">
          <div className="form-group">
            <label className="form-label">Düğün ID</label>
            <input
              type="text"
              className="form-input"
              value={weddingId}
              onChange={(e) => setWeddingId(e.target.value)}
              placeholder="Düğün ID'nizi girin"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Erişim Anahtarı</label>
            <input
              type="password"
              className="form-input"
              value={weddingKey}
              onChange={(e) => setWeddingKey(e.target.value)}
              placeholder="Erişim anahtarınızı girin"
              disabled={loading}
            />
          </div>
          

          <button 
            className={`login-button ${loading ? 'loading' : ''}`}
            onClick={onAuthenticate}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Doğrulanıyor...
              </>
            ) : (
              <>
                Galeriye Eriş
              </>
            )}
          </button>
        </div>

        <div className="login-footer">
          <p className="footer-text">Anılarınız güvenle korunuyor</p>
          <div className="footer-features">
            <div className="footer-feature">
              <div className="footer-feature-icon">🛡️</div>
              <div className="footer-feature-text">Özel ve Güvenli</div>
            </div>
            <div className="footer-feature">
              <div className="footer-feature-icon">⚡</div>
              <div className="footer-feature-text">Hızlı Yükleme</div>
            </div>
            <div className="footer-feature">
              <div className="footer-feature-icon">📱</div>
              <div className="footer-feature-text">Mobil Uyumlu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;