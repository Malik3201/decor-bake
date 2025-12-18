# Decor Bake Backend API

Production-ready backend for Temu-style ecommerce platform built with Node.js, Express.js, and MongoDB.

## Features

- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ Admin & User Roles
- ✅ Admin Settings Management
- ✅ Category Management
- ✅ Product Management with Dynamic Pricing
- ✅ Offer System (Dynamic Discounts)
- ✅ File Upload System
- ✅ Soft Deletes
- ✅ Input Validation
- ✅ Rate Limiting
- ✅ Security Headers (Helmet)
- ✅ CORS Configuration
- ✅ Error Handling
- ✅ MongoDB Indexes
- ✅ Slug Generation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **multer** - File uploads
- **helmet** - Security headers
- **morgan** - HTTP request logger

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # MongoDB models
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── utils/           # Utility functions
│   ├── validators/      # Input validators
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── uploads/             # Uploaded files (created automatically)
├── .env                 # Environment variables (create from .env.example)
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/decor-bake
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
```

4. Start MongoDB (if running locally)

5. Create admin user (optional but recommended):
```bash
npm run create-admin
```
This creates a default admin user:
- Email: `admin@decorbake.com`
- Password: `admin123`
⚠️ Change this password after first login!

6. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh-token` - Refresh access token
- `POST /logout` - Logout user (protected)
- `GET /me` - Get current user (protected)

### Admin Settings (`/api/v1/admin/settings`)
- `GET /` - Get settings (public)
- `PUT /` - Update settings (admin only)

### Categories (`/api/v1/categories`)
- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `GET /slug/:slug` - Get category by slug
- `POST /` - Create category (admin only)
- `PUT /:id` - Update category (admin only)
- `DELETE /:id` - Delete category (admin only)

### Products (`/api/v1/products`)
- `GET /` - Get products (with pagination & filters)
- `GET /featured` - Get featured products
- `GET /category/:categoryId` - Get products by category
- `GET /:id` - Get product by ID
- `GET /slug/:slug` - Get product by slug
- `GET /:id/price` - Get product price with offers
- `GET /:id/shipping` - Calculate shipping fee
- `POST /` - Create product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)

### Offers (`/api/v1/offers`)
- `GET /` - Get all offers
- `GET /active` - Get active offers
- `GET /:id` - Get offer by ID
- `GET /:id/products` - Get offer products with discounted prices
- `POST /` - Create offer (admin only)
- `PUT /:id` - Update offer (admin only)
- `DELETE /:id` - Delete offer (admin only)

### File Upload (`/api/v1/upload`)
- `POST /single` - Upload single file (admin only)
- `POST /multiple` - Upload multiple files (admin only)

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/decor-bake

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/jpg

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# CORS
CORS_ORIGIN=*
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

Admin-only routes require the user to have the `admin` role.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure MongoDB connection string
- [ ] Set up proper CORS origins
- [ ] Configure file upload to cloud storage (AWS S3, Cloudinary, etc.)
- [ ] Set up logging service
- [ ] Configure rate limiting for production
- [ ] Set up monitoring and error tracking
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure environment-specific settings

## License

ISC

