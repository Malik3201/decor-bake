import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  variants: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number,
    default: null,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, 'Subtotal cannot be negative'],
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: [0, 'Shipping fee cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    promoCode: {
      type: String,
      default: null,
    },
    total: {
      type: Number,
      default: 0,
      min: [0, 'Total cannot be negative'],
    },
    lastCalculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
cartSchema.index({ userId: 1 }, { unique: true });
cartSchema.index({ 'items.productId': 1 });

// Method to recalculate cart totals
cartSchema.methods.recalculate = async function () {
  const Product = mongoose.model('Product');
  const Offer = mongoose.model('Offer');
  const Settings = mongoose.model('Settings');
  const PromoCode = mongoose.model('PromoCode');

  if (!this.items || this.items.length === 0) {
    this.subtotal = 0;
    this.shippingFee = 0;
    this.discount = 0;
    this.total = 0;
    this.lastCalculatedAt = new Date();
    return this;
  }

  const now = new Date();
  // Normalize product IDs (handles both populated and non-populated cases)
  const productIds = this.items.map(item => {
    if (item.productId && typeof item.productId === 'object' && item.productId._id) {
      return item.productId._id;
    }
    return item.productId;
  });

  // Batch fetch all relevant data to avoid N+1 queries
  const [products, activeOffers, settings] = await Promise.all([
    Product.find({ _id: { $in: productIds }, isDeleted: false, isActive: true }),
    Offer.find({
      productIds: { $in: productIds },
      isActive: true,
      isDeleted: false,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ discountPercentage: -1 }),
    Settings.getSettings()
  ]);

  // Create lookups for faster access
  const productMap = new Map(products.map(p => [p._id.toString(), p]));
  
  // Group offers by product
  const offerMap = new Map();
  activeOffers.forEach(offer => {
    offer.productIds.forEach(pId => {
      const pidStr = pId.toString();
      if (!offerMap.has(pidStr)) {
        offerMap.set(pidStr, []);
      }
      offerMap.get(pidStr).push(offer);
    });
  });

  let subtotal = 0;
  let maxProductShippingFee = 0;

  // Process items
  for (let item of this.items) {
    // Normalize ID for lookup
    const pIdStr = (item.productId?._id || item.productId).toString();
    const product = productMap.get(pIdStr);
    if (!product) continue;

    // Get the best offer for this product
    const productOffers = offerMap.get(pIdStr) || [];
    let discountPercentage = 0;

    if (productOffers.length > 0) {
      // Offers are already sorted by discountPercentage desc
      discountPercentage = productOffers[0].discountPercentage;
    }

    const itemPrice = product.price;
    const itemDiscountPrice = Math.round(itemPrice * (1 - discountPercentage / 100) * 100) / 100;

    item.price = itemPrice;
    item.discountPrice = itemDiscountPrice;
    item.discountPercentage = discountPercentage;

    subtotal += itemDiscountPrice * item.quantity;

    if (product.productShippingFee !== null) {
      maxProductShippingFee = Math.max(maxProductShippingFee, product.productShippingFee);
    }
  }

  this.subtotal = Math.round(subtotal * 100) / 100;

  // Calculate shipping fee
  let shippingFee = 0;
  if (this.subtotal < settings.freeShippingThreshold) {
    shippingFee = maxProductShippingFee > 0 ? maxProductShippingFee : settings.defaultShippingFee;
  }
  this.shippingFee = shippingFee;

  // Apply promo code if exists
  let discount = 0;
  if (this.promoCode) {
    const promo = await PromoCode.findOne({
      code: this.promoCode,
      isActive: true,
      isDeleted: false,
      expiryDate: { $gte: now },
    });

    if (promo && promo.usedCount < promo.usageLimit && this.subtotal >= promo.minPurchaseAmount) {
      if (promo.discountType === 'percentage') {
        discount = this.subtotal * (promo.discountValue / 100);
        if (promo.maxDiscountAmount) {
          discount = Math.min(discount, promo.maxDiscountAmount);
        }
      } else {
        discount = Math.min(promo.discountValue, this.subtotal);
      }
    } else {
      this.promoCode = null;
    }
  }

  this.discount = Math.round(discount * 100) / 100;
  this.total = Math.round((this.subtotal + shippingFee - this.discount) * 100) / 100;
  this.lastCalculatedAt = new Date();

  return this;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
