const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ratingsMeta = new Schema(
  {
    productID:{
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true
    },
    ratingLevels: {
      1: {
        type: Number,
        default: 0
      },
      2: {
        type: Number,
        default: 0
      },
      3: {
        type: Number,
        default: 0
      },
      4: {
        type: Number,
        default: 0
      },
      5: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

const RatingsMeta = mongoose.model('RatingsMeta', ratingsMeta);

module.exports = RatingsMeta;
