import express from 'express';
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  getDefaultAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import {
  createAddressValidator,
  updateAddressValidator,
} from '../validators/addressValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/default', getDefaultAddress);
router.get('/', getUserAddresses);
router.get('/:id', getAddressById);
router.post('/', createAddressValidator, validate, createAddress);
router.put('/:id', updateAddressValidator, validate, updateAddress);
router.delete('/:id', deleteAddress);

export default router;

