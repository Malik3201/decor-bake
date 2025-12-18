import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    defaultShippingFee: {
      type: Number,
      default: 0,
      min: [0, 'Shipping fee cannot be negative'],
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
      min: [0, 'Free shipping threshold cannot be negative'],
    },
    announcementText: {
      type: String,
      default: '',
      maxlength: [500, 'Announcement text cannot exceed 500 characters'],
      trim: true,
    },
    siteStatus: {
      type: String,
      enum: ['active', 'maintenance', 'coming_soon'],
      default: 'active',
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      length: [3, 'Currency must be a 3-character code'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;

