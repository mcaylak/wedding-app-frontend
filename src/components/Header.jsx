import React from 'react';

const Header = ({ activeTab, setActiveTab, weddingDetails }) => {
  const tabs = [
    { id: 'home', name: 'Ana Sayfa', icon: '🏠' },
    { id: 'gallery', name: 'Galeri', icon: '📷' },
    { id: 'upload', name: 'Fotoğraf Yükle', icon: '📤' },
    { id: 'search', name: 'Yüz Arama', icon: '🔍' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">💒</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Düğün Galerisi</h1>
              <p className="text-xs text-gray-500">Özel anlarınız</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {weddingDetails?.brideName && weddingDetails?.groomName 
                  ? `${weddingDetails.brideName} & ${weddingDetails.groomName}` 
                  : weddingDetails?.weddingName || 'Düğün Çifti'}
              </p>
              <p className="text-xs text-gray-500">
                {weddingDetails?.weddingDate 
                  ? new Date(weddingDetails.weddingDate).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Düğün Günü'
                }
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {weddingDetails?.brideName && weddingDetails?.groomName 
                  ? `${weddingDetails.brideName.charAt(0)}${weddingDetails.groomName.charAt(0)}` 
                  : '💒'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;