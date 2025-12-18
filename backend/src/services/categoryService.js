import Category from '../models/Category.js';
import { AppError } from '../utils/errorHandler.js';

export const createCategory = async (categoryData) => {
  const category = await Category.create(categoryData);
  return category;
};

export const getCategories = async (options = {}) => {
  const { isActive, includeDeleted = false } = options;
  const query = {};

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  if (includeDeleted) {
    query.isDeleted = { $in: [true, false] };
  }

  const categories = await Category.find(query)
    .sort({ orderIndex: 1, createdAt: -1 })
    .select('-isDeleted -deletedAt');

  return categories;
};

export const getCategoryById = async (id, includeDeleted = false) => {
  const query = { _id: id };
  if (!includeDeleted) {
    query.isDeleted = false;
  }

  const category = await Category.findOne(query);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return category;
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, isDeleted: false });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return category;
};

export const updateCategory = async (id, updateData) => {
  const category = await Category.findById(id);
  if (!category || category.isDeleted) {
    throw new AppError('Category not found', 404);
  }

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      category[key] = updateData[key];
    }
  });

  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category || category.isDeleted) {
    throw new AppError('Category not found', 404);
  }

  await category.softDelete();
  return category;
};

