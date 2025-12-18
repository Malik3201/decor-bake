// Additional database indexes for performance optimization
// These are created automatically by Mongoose, but listed here for reference

export const createIndexes = async () => {
  // This file serves as documentation for all indexes
  // Indexes are defined in individual model files
  
  // User indexes
  // - email: 1
  // - role: 1
  
  // Product indexes
  // - slug: 1
  // - categoryId: 1
  // - isActive: 1
  // - isFeatured: 1
  // - price: 1
  // - createdAt: -1
  
  // Category indexes
  // - slug: 1
  // - isActive: 1
  // - orderIndex: 1
  
  // Offer indexes
  // - productIds: 1
  // - startDate: 1, endDate: 1
  // - isActive: 1
  // - endDate: 1
  
  // Cart indexes
  // - userId: 1
  // - items.productId: 1
  
  // Order indexes
  // - userId: 1
  // - orderNumber: 1
  // - status: 1
  // - paymentStatus: 1
  // - userId: 1, status: 1
  // - createdAt: -1
  // - items.productId: 1
  
  // Payment indexes
  // - orderId: 1
  // - userId: 1
  // - paymentIntentId: 1
  // - transactionId: 1
  // - status: 1
  // - userId: 1, status: 1
  // - createdAt: -1
  
  // Address indexes
  // - userId: 1
  // - userId: 1, isDefault: 1
  // - userId: 1, isDeleted: 1
  
  // PromoCode indexes
  // - code: 1
  // - isActive: 1, expiryDate: 1
  // - isActive: 1, isDeleted: 1
  
  console.log('All indexes are defined in model files and will be created automatically');
};

