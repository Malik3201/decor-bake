import multer from 'multer';
import path from 'path';
// import fs from 'fs'; // DISABLED: Local filesystem not allowed on Vercel
import { AppError } from '../utils/errorHandler.js';
import { FILE_UPLOAD } from '../config/constants.js';

// DISABLED: Local directory creation is not allowed in serverless environment
/*
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
*/

// Configure storage - Use memoryStorage as a safe placeholder for serverless
// TODO: Replace with Cloudinary or S3 for persistent storage
const storage = multer.memoryStorage();

/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
*/

// File filter
const fileFilter = (req, file, cb) => {
  if (FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Allowed types: ${FILE_UPLOAD.ALLOWED_TYPES.join(', ')}`,
        400
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
  },
  fileFilter,
});

// Single file upload middleware
export const uploadSingle = (fieldName = 'image') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('File size too large', 400));
          }
          return next(new AppError(err.message, 400));
        }
        return next(err);
      }
      
      // Memory storage doesn't set filename, so we set a temp one for compatibility
      if (req.file) {
        req.file.filename = `temp-${Date.now()}-${req.file.originalname}`;
      }
      
      next();
    });
  };
};

// Multiple files upload middleware
export const uploadMultiple = (fieldName = 'images', maxCount = 10) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('File size too large', 400));
          }
          if (err.code === 'LIMIT_FILE_COUNT') {
            return next(new AppError(`Maximum ${maxCount} files allowed`, 400));
          }
          return next(new AppError(err.message, 400));
        }
        return next(err);
      }

      // Memory storage doesn't set filename, so we set temp ones for compatibility
      if (req.files) {
        req.files.forEach(file => {
          file.filename = `temp-${Date.now()}-${file.originalname}`;
        });
      }

      next();
    });
  };
};

// Helper to get file URL
export const getFileUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  // TODO: Point to S3/Cloudinary URL in the future
  return `/uploads/${filename}`;
};

