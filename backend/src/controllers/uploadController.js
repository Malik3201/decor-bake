import { asyncHandler } from '../utils/errorHandler.js';
import { getFileUrl } from '../middlewares/upload.js';

export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded',
    });
  }

  const fileUrl = getFileUrl(req.file.filename);

  res.status(200).json({
    success: true,
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
    },
  });
});

export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files uploaded',
    });
  }

  const files = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: getFileUrl(file.filename),
  }));

  res.status(200).json({
    success: true,
    count: files.length,
    data: files,
  });
});

