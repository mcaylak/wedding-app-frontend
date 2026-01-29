import React from 'react';

const Footer = ({ weddingDetails }) => {
  return (
    <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Düğün Galerisi</h3>
                  <p className="text-sm text-gray-500">Özel anlarınız</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Düğün gününüzden güzel anıları yakalayın ve paylaşın. 
                Güvenli galerimiz kıymetli anlarınızı güvende ve erişilebilir tutar.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Özellikler</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">📷</span>
                  Fotoğraf Galerisi
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📤</span>
                  Kolay Yükleme
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔍</span>
                  Yüz Arama
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🔒</span>
                  Güvenli Erişim
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Destek</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <span className="flex items-center">
                    <span className="mr-2">💝</span>
                    Sonsuz Anılar
                  </span>
                </li>
                <li>
                  <span className="flex items-center">
                    <span className="mr-2">📱</span>
                    Mobil Uyumlu
                  </span>
                </li>
                <li>
                  <span className="flex items-center">
                    <span className="mr-2">⚡</span>
                    Hızlı Yükleme
                  </span>
                </li>
                <li>
                  <span className="flex items-center">
                    <span className="mr-2">🛡️</span>
                    Özel ve Güvenli
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm text-gray-500">
                  © 2024 Düğün Galerisi. Tüm hakları saklıdır.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-500">
                  {weddingDetails?.brideName && weddingDetails?.groomName 
                    ? `${weddingDetails.brideName} & ${weddingDetails.groomName} için ❤️ ile yapıldı` 
                    : '❤️ ile yapıldı'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;