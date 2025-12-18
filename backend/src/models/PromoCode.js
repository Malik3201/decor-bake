import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/softDelete.js';

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Promo code is required'],
      uppercase: true,
      trim: true,
      maxlength: [50, 'Promo code cannot exceed 50 characters'],
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    usageLimit: {
      type: Number,
      required: [true, 'Usage limit is required'],
      min: [1, 'Usage limit must be at least 1'],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count cannot be negative'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase amount cannot be negative'],
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: [0, 'Maximum discount amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Apply soft delete plugin
softDeletePlugin(promoCodeSchema);

// Indexes
promoCodeSchema.index({ code: 1 }, { unique: true });
promoCodeSchema.index({ isActive: 1, expiryDate: 1 });
promoCodeSchema.index({ isActive: 1, isDeleted: 1 });

// Validate discount value based on type
promoCodeSchema.pre('save', function (next) {
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    return next(new Error('Percentage discount cannot exceed 100'));
  }
  next();
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;

