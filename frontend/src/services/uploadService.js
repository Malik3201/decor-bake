import api from './api.js';

export const uploadService = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // backend wraps data under data.url
    return response.data?.data?.url;
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // backend returns array of { url }
    const uploaded = response.data?.data || [];
    return uploaded.map((f) => f.url);
  },
};


