// models/Product.js
const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  imgURL: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  id:{
    type: String,
    default: uuidv4,
    unique: true
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
