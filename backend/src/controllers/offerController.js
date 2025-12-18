import { asyncHandler } from '../utils/errorHandler.js';
import * as offerService from '../services/offerService.js';

export const createOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.createOffer(req.body);
  res.status(201).json({
    success: true,
    data: offer,
  });
});

export const getOffers = asyncHandler(async (req, res) => {
  const { page, limit, isActive, activeOnly } = req.query;

  const result = await offerService.getOffers({
    page,
    limit,
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
    activeOnly: activeOnly === 'true',
  });

  res.status(200).json({
    success: true,
    count: result.offers.length,
    pagination: result.pagination,
    data: result.offers,
  });
});

export const getActiveOffers = asyncHandler(async (req, res) => {
  const offers = await offerService.getActiveOffers();
  res.status(200).json({
    success: true,
    count: offers.length,
    data: offers,
  });
});

export const getOfferById = asyncHandler(async (req, res) => {
  const offer = await offerService.getOfferById(req.params.id);
  res.status(200).json({
    success: true,
    data: offer,
  });
});

export const getOfferProducts = asyncHandler(async (req, res) => {
  const result = await offerService.getOfferProducts(req.params.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await offerService.updateOffer(req.params.id, req.body);
  res.status(200).json({
    success: true,
    data: offer,
    message: 'Offer updated successfully',
  });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  await offerService.deleteOffer(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Offer deleted successfully',
  });
});

