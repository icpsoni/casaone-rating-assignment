const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ratings = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    reviewHeading: {
      type: String
    },
    reviewDescription : {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Ratings = mongoose.model('Ratings', ratings);

module.exports = Ratings;
