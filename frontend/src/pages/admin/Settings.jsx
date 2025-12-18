import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService.js';
import { adminService } from '../../services/adminService.js';
import { Loading } from '../../components/common/Loading.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    defaultShippingFee: '',
    freeShippingThreshold: '',
    announcementText: '',
    siteStatus: 'active',
    currency: 'USD',
  });
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSettings();
      const data = response.data;
      setSettings(data);
      setFormData({
        defaultShippingFee: data.defaultShippingFee || '',
        freeShippingThreshold: data.freeShippingThreshold || '',
        announcementText: data.announcementText || '',
        siteStatus: data.siteStatus || 'active',
        currency: data.currency || 'USD',
      });
    } catch (err) {
      showError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateSettings(formData);
      success('Settings updated successfully');
      fetchSettings();
    } catch (err) {
      showError('Failed to update settings');
    }
  };

  if (loading) {
    return <Loading size="lg" />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Site Settings</h1>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Shipping Fee
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.defaultShippingFee}
                onChange={(e) => setFormData({ ...formData, defaultShippingFee: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Orders above this amount get free shipping
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Announcement Text
            </label>
            <textarea
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              rows="3"
              maxLength={500}
              placeholder="Enter announcement text (shown in announcement bar)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.announcementText.length} / 500 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Status
              </label>
              <select
                value={formData.siteStatus}
                onChange={(e) => setFormData({ ...formData, siteStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <input
                type="text"
                maxLength={3}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 uppercase"
                placeholder="USD"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button variant="primary" type="submit" size="lg">
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

