import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/softDelete.js';
import { generateSlug } from '../utils/slugGenerator.js';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
      min: [0, 'Order index cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Apply soft delete plugin
softDeletePlugin(categorySchema);

// Indexes
categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ isActive: 1 });
categorySchema.index({ orderIndex: 1 });

// Generate slug before saving
categorySchema.pre('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = generateSlug(this.name);
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Efficiently check for existing slugs
    while (await mongoose.model('Category').countDocuments({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = uniqueSlug;
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;

