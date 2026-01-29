import React from 'react';

const HomePage = ({ authToken, weddingId, weddingDetails }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(102,126,234,0.1)"/><circle cx="75" cy="75" r="1.5" fill="rgba(118,75,162,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(102,126,234,0.1)"/><circle cx="10" cy="60" r="1" fill="rgba(118,75,162,0.05)"/><circle cx="90" cy="30" r="0.8" fill="rgba(102,126,234,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-white/30 to-indigo-100/50"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">💒</span>
            </div>
            <h1 className="text-5xl font-light text-gray-800 mb-4 tracking-tight">
              {weddingDetails?.brideName && weddingDetails?.groomName 
                ? `${weddingDetails.brideName} & ${weddingDetails.groomName}` 
                : weddingDetails?.weddingName || 'Galerimize Hoş Geldiniz'}
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              {weddingDetails?.welcomeMessage || 
               'A beautiful collection of memories from our special day. Explore your private wedding photo gallery using the navigation above.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fotoğraf Galerisi</h3>
              <p className="text-gray-600 text-sm">Güzel düğün anılarımıza göz atın</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fotoğraf Yükle</h3>
              <p className="text-gray-600 text-sm">Güzel çekimlerinizi paylaşın</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Yüz Arama</h3>
              <p className="text-gray-600 text-sm">Fotoğraflarda kendinizi bulun</p>
            </div>
          </div>

          {/* Wedding Details Section */}
          {(weddingDetails?.weddingDate || weddingDetails?.venue || weddingDetails?.ceremonyTime || weddingDetails?.receptionTime) && (
            <div className="mt-16 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Wedding Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {weddingDetails?.weddingDate && (
                    <div>
                      <div className="text-2xl mb-2">📅</div>
                      <h4 className="font-semibold text-gray-700 mb-1">Date</h4>
                      <p className="text-gray-600">
                        {new Date(weddingDetails.weddingDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {weddingDetails?.venue && (
                    <div>
                      <div className="text-2xl mb-2">📍</div>
                      <h4 className="font-semibold text-gray-700 mb-1">Venue</h4>
                      <p className="text-gray-600">{weddingDetails.venue}</p>
                    </div>
                  )}

                  {weddingDetails?.ceremonyTime && (
                    <div>
                      <div className="text-2xl mb-2">⛪</div>
                      <h4 className="font-semibold text-gray-700 mb-1">Ceremony</h4>
                      <p className="text-gray-600">{weddingDetails.ceremonyTime}</p>
                    </div>
                  )}

                  {weddingDetails?.receptionTime && (
                    <div>
                      <div className="text-2xl mb-2">🎉</div>
                      <h4 className="font-semibold text-gray-700 mb-1">Reception</h4>
                      <p className="text-gray-600">{weddingDetails.receptionTime}</p>
                    </div>
                  )}
                </div>

                {weddingDetails?.specialMessage && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 italic">{weddingDetails.specialMessage}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 border-2 border-indigo-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-indigo-400/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;