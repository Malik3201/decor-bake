# API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "access_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

---

## 2. Settings Endpoints

### Get Settings (Public)
```http
GET /admin/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "defaultShippingFee": 5.99,
    "freeShippingThreshold": 50,
    "announcementText": "Welcome!",
    "siteStatus": "active",
    "currency": "USD"
  }
}
```

### Update Settings (Admin Only)
```http
PUT /admin/settings
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "defaultShippingFee": 7.99,
  "freeShippingThreshold": 75
}
```

---

## 3. Category Endpoints

### Get All Categories
```http
GET /categories?isActive=true
```

### Get Category by ID
```http
GET /categories/:id
```

### Get Category by Slug
```http
GET /categories/slug/:slug
```

### Create Category (Admin Only)
```http
POST /categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics",
  "image": "https://example.com/image.jpg",
  "isActive": true,
  "orderIndex": 1
}
```

### Update Category (Admin Only)
```http
PUT /categories/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "isActive": false
}
```

### Delete Category (Admin Only)
```http
DELETE /categories/:id
Authorization: Bearer <admin_token>
```

---

## 4. Product Endpoints

### Get Products
```http
GET /products?page=1&limit=20&categoryId=xxx&isActive=true&isFeatured=true&search=laptop&sortBy=price&sortOrder=asc
```

### Get Featured Products
```http
GET /products/featured?limit=10
```

### Get Products by Category
```http
GET /products/category/:categoryId?limit=20
```

### Get Product by ID
```http
GET /products/:id
```

### Get Product by Slug
```http
GET /products/slug/:slug
```

### Get Product Price (with offers)
```http
GET /products/:id/price
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalPrice": 100,
    "finalPrice": 80,
    "discountPercentage": 20,
    "offer": {
      "id": "offer_id",
      "title": "Summer Sale",
      "discountPercentage": 20,
      "remainingTime": 86400000
    }
  }
}
```

### Calculate Shipping Fee
```http
GET /products/:id/shipping?cartTotal=45
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shippingFee": 5.99
  }
}
```

### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Laptop",
  "description": "High performance laptop",
  "categoryId": "category_id",
  "price": 999.99,
  "images": ["url1", "url2"],
  "isFeatured": true,
  "isActive": true,
  "productShippingFee": 10.99
}
```

### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 899.99,
  "isFeatured": false
}
```

### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

---

## 5. Offer Endpoints

### Get All Offers
```http
GET /offers?page=1&limit=20&isActive=true&activeOnly=true
```

### Get Active Offers
```http
GET /offers/active
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "offer_id",
      "title": "Summer Sale",
      "discountPercentage": 20,
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "remainingTime": 86400000,
      "productIds": [...]
    }
  ]
}
```

### Get Offer by ID
```http
GET /offers/:id
```

### Get Offer Products (with discounted prices)
```http
GET /offers/:id/products
```

**Response:**
```json
{
  "success": true,
  "data": {
    "offer": {
      "id": "offer_id",
      "title": "Summer Sale",
      "discountPercentage": 20,
      "remainingTime": 86400000,
      "isActive": true
    },
    "products": [
      {
        "_id": "product_id",
        "title": "Product Name",
        "originalPrice": 100,
        "discountedPrice": 80,
        "discountPercentage": 20
      }
    ]
  }
}
```

### Create Offer (Admin Only)
```http
POST /offers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Summer Sale",
  "productIds": ["product_id1", "product_id2"],
  "discountPercentage": 20,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": true
}
```

### Update Offer (Admin Only)
```http
PUT /offers/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "discountPercentage": 25
}
```

### Delete Offer (Admin Only)
```http
DELETE /offers/:id
Authorization: Bearer <admin_token>
```

---

## 6. File Upload Endpoints

### Upload Single File (Admin Only)
```http
POST /upload/single
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- image: <file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "image-1234567890.jpg",
    "originalName": "photo.jpg",
    "size": 123456,
    "mimetype": "image/jpeg",
    "url": "/uploads/image-1234567890.jpg"
  }
}
```

### Upload Multiple Files (Admin Only)
```http
POST /upload/multiple
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- images: <file1>
- images: <file2>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "filename": "image-1.jpg",
      "url": "/uploads/image-1.jpg"
    },
    {
      "filename": "image-2.jpg",
      "url": "/uploads/image-2.jpg"
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

Rate limit headers are included in responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

