export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const SITE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  COMING_SOON: 'coming_soon',
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
};

export const FILE_UPLOAD = {
  MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  ALLOWED_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/jpg').split(','),
};

