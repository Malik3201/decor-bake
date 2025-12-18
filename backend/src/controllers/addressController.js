import { asyncHandler } from '../utils/errorHandler.js';
import * as addressService from '../services/addressService.js';

export const createAddress = asyncHandler(async (req, res) => {
  const address = await addressService.createAddress(req.user._id, req.body);
  res.status(201).json({
    success: true,
    data: address,
  });
});

export const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressService.getUserAddresses(req.user._id);
  res.status(200).json({
    success: true,
    count: addresses.length,
    data: addresses,
  });
});

export const getAddressById = asyncHandler(async (req, res) => {
  const address = await addressService.getAddressById(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    data: address,
  });
});

export const getDefaultAddress = asyncHandler(async (req, res) => {
  const address = await addressService.getDefaultAddress(req.user._id);
  res.status(200).json({
    success: true,
    data: address,
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressService.updateAddress(
    req.params.id,
    req.user._id,
    req.body
  );
  res.status(200).json({
    success: true,
    data: address,
    message: 'Address updated successfully',
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await addressService.deleteAddress(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
  });
});

