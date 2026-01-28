import React, { useEffect, useState } from 'react';

const QRCodeGenerator = ({ data, size = 200 }) => {
  const [qrCodeSvg, setQrCodeSvg] = useState('');

  // Simple QR Code generation using a free API service
  const generateQRCode = async (text) => {
    try {
      // Using qr-server.com free API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
      return qrUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  useEffect(() => {
    if (data) {
      generateQRCode(data).then(url => {
        setQrCodeSvg(url);
      });
    }
  }, [data, size]);

  const downloadQRCode = () => {
    if (qrCodeSvg) {
      const link = document.createElement('a');
      link.href = qrCodeSvg;
      link.download = 'wedding-qr-code.png';
      link.click();
    }
  };

  const printQRCode = () => {
    if (qrCodeSvg) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Wedding QR Code</title>
            <style>
              body { 
                text-align: center; 
                font-family: Arial, sans-serif; 
                padding: 20px; 
              }
              .qr-container { 
                margin: 20px auto; 
                display: inline-block; 
                padding: 20px; 
                border: 2px solid #000; 
                border-radius: 10px; 
              }
              .qr-text { 
                font-size: 16px; 
                margin-bottom: 15px; 
                color: #333; 
              }
              .qr-url { 
                font-size: 12px; 
                color: #666; 
                margin-top: 15px; 
                word-break: break-all; 
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="qr-text">Scan to access our wedding gallery</div>
              <img src="${qrCodeSvg}" alt="QR Code" />
              <div class="qr-url">${data}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!data) {
    return (
      <div className="text-center text-gray-500 py-4">
        No QR code data provided
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Wedding Gallery QR Code
        </h3>
        <p className="text-sm text-gray-600">
          Scan this code to access the wedding gallery
        </p>
      </div>
      
      {qrCodeSvg && (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <img 
              src={qrCodeSvg} 
              alt="QR Code" 
              className="block"
              style={{ width: size, height: size }}
            />
          </div>
          
          <div className="text-xs text-gray-500 text-center max-w-xs break-all">
            {data}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={downloadQRCode}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Download
            </button>
            <button
              onClick={printQRCode}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Print
            </button>
          </div>
        </div>
      )}
      
      {!qrCodeSvg && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Generating QR code...</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;