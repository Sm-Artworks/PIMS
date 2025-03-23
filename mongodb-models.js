// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'PHARMACIST', 'STAFF'],
    default: 'STAFF'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

// models/Medication.js
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genericName: String,
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  form: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  reorderLevel: {
    type: Number,
    required: true
  },
  currentStock: {
    type: Number,
    required: true
  },
  location: String,
  needsPrescription: {
    type: Boolean,
    default: true
  },
  barcode: String,
  notes: String
}, { timestamps: true });

// Virtual for checking if stock is low
medicationSchema.virtual('isLowStock').get(function() {
  return this.currentStock <= this.reorderLevel;
});

// Virtual for checking if medication is expiring soon (within 30 days)
medicationSchema.virtual('isExpiringSoon').get(function() {
  const today = new Date();
  const expiry = new Date(this.expirationDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
});

// Set virtuals to be included in JSON representation
medicationSchema.set('toJSON', { virtuals: true });
medicationSchema.set('toObject', { virtuals: true });

const Medication = mongoose.model('Medication', medicationSchema);
module.exports = Medication;

// models/Transaction.js
const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['SALE', 'RETURN', 'ADJUSTMENT', 'EXPIRY'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [transactionItemSchema],
  notes: String
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

// models/Supplier.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contactPerson: String,
  email: String,
  phone: {
    type: String,
    required: true
  },
  address: String
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;

// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  expectedDelivery: Date,
  actualDelivery: Date,
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  notes: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientContact: String,
  doctorName: {
    type: String,
    required: true
  },
  doctorContact: String,
  issueDate: {
    type: Date,
    required: true
  },
  expiryDate: Date,
  status: {
    type: String,
    enum: ['ACTIVE', 'FILLED', 'EXPIRED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  notes: String
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
