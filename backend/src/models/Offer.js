import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/softDelete.js';

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
      maxlength: [200, 'Offer title cannot exceed 200 characters'],
    },
    productIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      required: [true, 'At least one product is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one product is required',
      },
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (v) {
          return v > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Apply soft delete plugin
softDeletePlugin(offerSchema);

// Indexes
offerSchema.index({ productIds: 1 });
offerSchema.index({ startDate: 1, endDate: 1 });
offerSchema.index({ isActive: 1 });
offerSchema.index({ endDate: 1 });

// Method to check if offer is currently active
offerSchema.methods.isCurrentlyActive = function () {
  const now = new Date();
  return (
    this.isActive &&
    !this.isDeleted &&
    now >= this.startDate &&
    now <= this.endDate
  );
};

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;

