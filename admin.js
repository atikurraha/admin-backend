// Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Manager', 'Editor'],
    default: 'Admin'
  },
  permissions: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

// Supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  paymentTerms: {
    type: String
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Supplier', supplierSchema);

// Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'E-commerce Store'
  },
  siteTagline: {
    type: String
  },
  adminEmail: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  currencySymbol: {
    type: String,
    default: '$'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  dateFormat: {
    type: String,
    default: 'MM/DD/YYYY'
  },
  freeShippingThreshold: {
    type: Number,
    default: 50
  },
  taxRate: {
    type: Number,
    default: 0
  },
  paymentGateways: {
    stripe: {
      enabled: {
        type: Boolean,
        default: false
      },
      publicKey: String,
      secretKey: String
    },
    paypal: {
      enabled: {
        type: Boolean,
        default: false
      },
      clientId: String,
      clientSecret: String
    },
    bKash: {
      enabled: {
        type: Boolean,
        default: false
      },
      username: String,
      password: String,
      appKey: String,
      appSecret: String
    },
    nagad: {
      enabled: {
        type: Boolean,
        default: false
      },
      merchantId: String
    },
    rocket: {
      enabled: {
        type: Boolean,
        default: false
      },
      merchantId: String
    }
  },
  emailSettings: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPass: String,
    fromEmail: String,
    fromName: String
  },
  seoSettings: {
    metaTitle: String,
    metaDescription: String,
    googleAnalyticsId: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
