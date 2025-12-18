import { asyncHandler } from '../utils/errorHandler.js';
import * as categoryService from '../services/categoryService.js';

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({
    success: true,
    data: category,
  });
});

export const getCategories = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const categories = await categoryService.getCategories({
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
  });
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json({
    success: true,
    data: category,
  });
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.status(200).json({
    success: true,
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: category,
    message: 'Category updated successfully',
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});

