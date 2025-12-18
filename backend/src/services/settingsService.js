import Settings from '../models/Settings.js';
import { AppError } from '../utils/errorHandler.js';

export const getSettings = async () => {
  const settings = await Settings.getSettings();
  return settings;
};

export const updateSettings = async (updateData) => {
  let settings = await Settings.findOne();
  
  if (!settings) {
    settings = await Settings.create(updateData);
  } else {
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        settings[key] = updateData[key];
      }
    });
    await settings.save();
  }

  return settings;
};

