import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  minSellingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    default: 'pcs',
    trim: true,
  },
  dose: {
    type: String,
    trim: true,
  },
  hsnCode: {
    type: String,
    trim: true,
  },
  gstRate: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
