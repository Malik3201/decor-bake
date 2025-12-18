import Address from '../models/Address.js';
import { AppError } from '../utils/errorHandler.js';

export const createAddress = async (userId, addressData) => {
  // If this is set as default, unset other defaults
  if (addressData.isDefault) {
    await Address.updateMany(
      { userId, isDeleted: false },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    ...addressData,
    userId,
  });

  return address;
};

export const getUserAddresses = async (userId) => {
  const addresses = await Address.find({
    userId,
    isDeleted: false,
  }).sort({ isDefault: -1, createdAt: -1 });

  return addresses;
};

export const getAddressById = async (addressId, userId) => {
  const address = await Address.findOne({
    _id: addressId,
    userId,
    isDeleted: false,
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  return address;
};

export const getDefaultAddress = async (userId) => {
  const address = await Address.findOne({
    userId,
    isDefault: true,
    isDeleted: false,
  });

  return address;
};

export const updateAddress = async (addressId, userId, updateData) => {
  const address = await Address.findOne({
    _id: addressId,
    userId,
    isDeleted: false,
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  // If setting as default, unset other defaults
  if (updateData.isDefault && !address.isDefault) {
    await Address.updateMany(
      { userId, _id: { $ne: addressId }, isDeleted: false },
      { isDefault: false }
    );
  }

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      address[key] = updateData[key];
    }
  });

  await address.save();
  return address;
};

export const deleteAddress = async (addressId, userId) => {
  const address = await Address.findOne({
    _id: addressId,
    userId,
    isDeleted: false,
  });

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  await address.softDelete();
  return address;
};

