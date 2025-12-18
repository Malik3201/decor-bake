import Offer from '../models/Offer.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/errorHandler.js';
import { DEFAULT_PAGINATION } from '../config/constants.js';

export const createOffer = async (offerData) => {
  // Verify all products exist
  const products = await Product.find({
    _id: { $in: offerData.productIds },
    isDeleted: false,
  });

  if (products.length !== offerData.productIds.length) {
    throw new AppError('One or more products not found', 404);
  }

  const offer = await Offer.create(offerData);
  return offer;
};

export const getOffers = async (options = {}) => {
  const {
    page = DEFAULT_PAGINATION.PAGE,
    limit = DEFAULT_PAGINATION.LIMIT,
    isActive,
    activeOnly = false,
  } = options;

  const query = { isDeleted: false };

  if (isActive !== undefined) {
    query.isActive = isActive;
  }

  if (activeOnly) {
    const now = new Date();
    query.startDate = { $lte: now };
    query.endDate = { $gte: now };
    query.isActive = true;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [offers, total] = await Promise.all([
    Offer.find(query)
      .populate('productIds', 'title price images slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Offer.countDocuments(query),
  ]);

  return {
    offers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getActiveOffers = async () => {
  const now = new Date();
  const offers = await Offer.find({
    isActive: true,
    isDeleted: false,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .populate('productIds', 'title price images slug')
    .sort({ discountPercentage: -1 });

  // Add remaining time to each offer
  const offersWithTime = offers.map(offer => {
    const remainingTime = Math.max(0, offer.endDate.getTime() - now.getTime());
    return {
      ...offer.toObject(),
      remainingTime,
    };
  });

  return offersWithTime;
};

export const getOfferById = async (id) => {
  const offer = await Offer.findById(id).populate('productIds', 'title price images slug');
  
  if (!offer || offer.isDeleted) {
    throw new AppError('Offer not found', 404);
  }

  return offer;
};

export const getOfferProducts = async (offerId) => {
  const offer = await Offer.findById(offerId).populate('productIds');
  
  if (!offer || offer.isDeleted) {
    throw new AppError('Offer not found', 404);
  }

  const now = new Date();
  const isActive = offer.isCurrentlyActive();

  // Calculate discounted prices for each product
  const productsWithDiscount = offer.productIds.map(product => {
    const discountedPrice = product.price * (1 - offer.discountPercentage / 100);
    const remainingTime = isActive ? Math.max(0, offer.endDate.getTime() - now.getTime()) : 0;

    return {
      ...product.toObject(),
      originalPrice: product.price,
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      discountPercentage: offer.discountPercentage,
      offerInfo: {
        id: offer._id,
        title: offer.title,
        startDate: offer.startDate,
        endDate: offer.endDate,
        remainingTime,
        isActive,
      },
    };
  });

  return {
    offer: {
      id: offer._id,
      title: offer.title,
      discountPercentage: offer.discountPercentage,
      startDate: offer.startDate,
      endDate: offer.endDate,
      isActive,
      remainingTime: isActive ? Math.max(0, offer.endDate.getTime() - now.getTime()) : 0,
    },
    products: productsWithDiscount,
  };
};

export const updateOffer = async (id, updateData) => {
  const offer = await Offer.findById(id);
  if (!offer || offer.isDeleted) {
    throw new AppError('Offer not found', 404);
  }

  // Verify products if being updated
  if (updateData.productIds) {
    const products = await Product.find({
      _id: { $in: updateData.productIds },
      isDeleted: false,
    });

    if (products.length !== updateData.productIds.length) {
      throw new AppError('One or more products not found', 404);
    }
  }

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      offer[key] = updateData[key];
    }
  });

  await offer.save();
  return offer.populate('productIds', 'title price images slug');
};

export const deleteOffer = async (id) => {
  const offer = await Offer.findById(id);
  if (!offer || offer.isDeleted) {
    throw new AppError('Offer not found', 404);
  }

  await offer.softDelete();
  return offer;
};

