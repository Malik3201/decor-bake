import { asyncHandler } from '../utils/errorHandler.js';
import * as productService from '../services/productService.js';

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({
    success: true,
    data: product,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    categoryId,
    isActive,
    isFeatured,
    search,
    sortBy,
    sortOrder,
  } = req.query;

  const result = await productService.getProducts({
    page,
    limit,
    categoryId,
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
    isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
    search,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    success: true,
    count: result.products.length,
    pagination: result.pagination,
    data: result.products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({
    success: true,
    data: product,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.status(200).json({
    success: true,
    data: product,
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const products = await productService.getFeaturedProducts(limit);
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { limit } = req.query;
  const products = await productService.getProductsByCategory(categoryId, limit);
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: product,
    message: 'Product updated successfully',
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

export const getProductPrice = asyncHandler(async (req, res) => {
  const priceInfo = await productService.calculateProductPrice(req.params.id);
  res.status(200).json({
    success: true,
    data: priceInfo,
  });
});

export const getShippingFee = asyncHandler(async (req, res) => {
  // Route is defined as '/:id/shipping', so use `id` here
  const { id } = req.params;
  const { cartTotal } = req.query;

  const shippingFee = await productService.calculateShippingFee(
    id,
    parseFloat(cartTotal) || 0
  );

  res.status(200).json({
    success: true,
    data: { shippingFee },
  });
});

