import React, { useState, useEffect } from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const AdminPage = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [showQRCode, setShowQRCode] = useState(null);
  const [formData, setFormData] = useState({
    weddingName: '',
    weddingKey: '',
    brideName: '',
    groomName: '',
    weddingDate: '',
    welcomeMessage: '',
    venue: '',
    ceremonyTime: '',
    receptionTime: '',
    specialMessage: ''
  });

  useEffect(() => {
    fetchWeddings();
  }, []);

  const fetchWeddings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/weddings`);
      if (response.ok) {
        const data = await response.json();
        setWeddings(data);
      }
    } catch (error) {
      console.error('Error fetching weddings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = selectedWedding 
        ? `${API_BASE_URL}/admin/weddings/${selectedWedding.id}`
        : `${API_BASE_URL}/admin/weddings`;
      
      const method = selectedWedding ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchWeddings();
        handleCloseForm();
        alert(selectedWedding ? 'Wedding updated successfully!' : 'Wedding created successfully!');
      } else {
        alert('Error saving wedding');
      }
    } catch (error) {
      console.error('Error saving wedding:', error);
      alert('Error saving wedding');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wedding) => {
    setSelectedWedding(wedding);
    setFormData({
      weddingName: wedding.weddingName || '',
      weddingKey: '', // Don't pre-fill password
      brideName: wedding.brideName || '',
      groomName: wedding.groomName || '',
      weddingDate: wedding.weddingDate || '',
      welcomeMessage: wedding.welcomeMessage || '',
      venue: wedding.venue || '',
      ceremonyTime: wedding.ceremonyTime || '',
      receptionTime: wedding.receptionTime || '',
      specialMessage: wedding.specialMessage || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (weddingId) => {
    if (!window.confirm('Are you sure you want to delete this wedding?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/weddings/${weddingId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchWeddings();
        alert('Wedding deleted successfully!');
      } else {
        alert('Error deleting wedding');
      }
    } catch (error) {
      console.error('Error deleting wedding:', error);
      alert('Error deleting wedding');
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setSelectedWedding(null);
    setFormData({
      weddingName: '',
      weddingKey: '',
      brideName: '',
      groomName: '',
      weddingDate: '',
      welcomeMessage: '',
      venue: '',
      ceremonyTime: '',
      receptionTime: '',
      specialMessage: ''
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
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
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl text-gray-800 font-light tracking-tight">
                Wedding Admin Panel
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Manage wedding galleries and generate QR codes
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Create New Wedding
            </button>
          </div>

          {/* Weddings List */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6">
            {loading && <div className="text-center py-8">Loading...</div>}
            
            {!loading && weddings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No weddings found. Create your first wedding!
              </div>
            )}

            {!loading && weddings.length > 0 && (
              <div className="space-y-4">
                {weddings.map(wedding => (
                  <div key={wedding.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {wedding.weddingName || 'Unnamed Wedding'}
                        </h3>
                        <p className="text-gray-600">
                          {wedding.brideName && wedding.groomName 
                            ? `${wedding.brideName} & ${wedding.groomName}`
                            : 'Names not set'
                          }
                        </p>
                        {wedding.weddingDate && (
                          <p className="text-gray-500 text-sm">
                            {new Date(wedding.weddingDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowQRCode(showQRCode === wedding.id ? null : wedding.id)}
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors text-sm"
                        >
                          {showQRCode === wedding.id ? 'Hide QR' : 'Show QR'}
                        </button>
                        <button
                          onClick={() => handleEdit(wedding)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(wedding.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-700">Wedding ID:</label>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {wedding.id}
                          </code>
                          <button
                            onClick={() => copyToClipboard(wedding.id)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      {wedding.qrCodeData && (
                        <div>
                          <label className="font-medium text-gray-700">QR Code URL:</label>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs truncate max-w-xs">
                              {wedding.qrCodeData}
                            </code>
                            <button
                              onClick={() => copyToClipboard(wedding.qrCodeData)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              📋
                            </button>
                          </div>
                        </div>
                      )}

                      {wedding.venue && (
                        <div>
                          <label className="font-medium text-gray-700">Venue:</label>
                          <p className="text-gray-600">{wedding.venue}</p>
                        </div>
                      )}

                      {wedding.ceremonyTime && (
                        <div>
                          <label className="font-medium text-gray-700">Ceremony Time:</label>
                          <p className="text-gray-600">{wedding.ceremonyTime}</p>
                        </div>
                      )}
                    </div>

                    {/* QR Code Section */}
                    {showQRCode === wedding.id && wedding.qrCodeData && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <QRCodeGenerator data={wedding.qrCodeData} size={150} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {selectedWedding ? 'Edit Wedding' : 'Create New Wedding'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wedding Name *
                  </label>
                  <input
                    type="text"
                    name="weddingName"
                    value={formData.weddingName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wedding Access Key *
                  </label>
                  <input
                    type="password"
                    name="weddingKey"
                    value={formData.weddingKey}
                    onChange={handleInputChange}
                    required={!selectedWedding}
                    placeholder={selectedWedding ? "Leave blank to keep current" : ""}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bride Name
                  </label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Groom Name
                  </label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    name="weddingDate"
                    value={formData.weddingDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ceremony Time
                  </label>
                  <input
                    type="text"
                    name="ceremonyTime"
                    value={formData.ceremonyTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 3:00 PM"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reception Time
                  </label>
                  <input
                    type="text"
                    name="receptionTime"
                    value={formData.receptionTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 6:00 PM"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Welcome Message
                </label>
                <textarea
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Welcome to our wedding gallery..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Message
                </label>
                <textarea
                  name="specialMessage"
                  value={formData.specialMessage}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Any special message or instructions..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (selectedWedding ? 'Update Wedding' : 'Create Wedding')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;