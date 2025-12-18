import api from './api.js';

export const settingsService = {
  // Get public settings (for announcement bar, etc.)
  getPublicSettings: async () => {
    const response = await api.get('/admin/settings/public');
    return response.data;
  },

  // Get all settings (admin only - requires auth)
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },
};

