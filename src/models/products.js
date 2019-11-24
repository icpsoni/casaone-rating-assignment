const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const products = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    rating: {
      totalRatings: {
        type: Number,
        default: 0,
        required: true
      },
      totalReviews: {
        type: Number,
        default: 0,
        required: true
      },
      avg: {
        type: Number,
        default: 0,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

const Products = mongoose.model('Products', products);

module.exports = Products;

