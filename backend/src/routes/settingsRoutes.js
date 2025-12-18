import express from 'express';
import { getSettings, updateSettings, getPublicSettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import { updateSettingsValidator } from '../validators/settingsValidator.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Public route for getting settings (for announcement bar, etc.)
router.get('/public', getPublicSettings);
// Admin routes
router.get('/', getSettings);
router.put('/', protect, authorize(USER_ROLES.ADMIN), updateSettingsValidator, validate, updateSettings);

export default router;

