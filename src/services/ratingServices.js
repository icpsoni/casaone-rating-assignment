const db = require('../models/index');
const RatingsServices = {};
const Message = require('../utilities/messages');

// Get Product rating
RatingsServices.getRating = (userID, productID) => {
  return new Promise((resolve, reject) => {
    if(userID && productID) {
      db.Ratings.findOne({userID, productID}).exec((err, result) => {
        if (err) {
          reject({errorCode: 500, Message: Message.DATABASE_ERROR});
        } else if (result) {
          reject({errorCode: 200, Message: Message.REVIEW_EXIST});
        } else {
          resolve();
        }
      });
    } else {
    }
  });
};

// Update Product Rating
RatingsServices.updateRating = (data) => {
  return new Promise((resolve, reject) => {
    db.Ratings.findOneAndUpdate({ userID: data.userID, productID: data.productID}, { $set: data }, (err, ratingData) => {
      if (err) {
        reject({errorCode: 500, Message: Message.DATABASE_ERROR});
      } else if (ratingData){
        resolve(ratingData);
      } else {
        reject({errorCode: 200,Message:Message.NO_DATA});
      }
    });
  });
};

// Delete Rating
RatingsServices.deleteRating = (userID, productID) => {
  return new Promise((resolve, reject) => {
    db.Ratings.findOneAndDelete({ userID, productID }, (err, ratingData) => {
      if (err) {
        reject({errorCode: 500, Message: Message.DATABASE_ERROR});
      } else if (ratingData) {
        resolve(ratingData);
      } else {
        reject({errorCode: 200, Message: Message.NO_DATA});
      }
    });
  });
};

// Update Avg rating and count
RatingsServices.updateToProduct = (productID, newRatings) => {
  console.log("Inside Add product");
  db.Products.findOneAndUpdate({ _id: productID }, {$set: {rating: newRatings}}, { new: true }, (err, result) => {
    if(err){
      console.log(err);
    } else {
      console.log("Product", result);
    }
  })
};

// Updating rating level count
RatingsServices.updateToRatingMeta = (productID, ratingCount) => {
  db.RatingMeta.findOneAndUpdate({ productID },
    { $inc: ratingCount },
    { upsert: true, new: true, setDefaultsOnInsert: true },
    (err, ratingMetaData) => {
      if (err) {
        console.log(err);
      } else {
        console.log(ratingMetaData);
      }
    });
};

// Get Rating Meta Data
RatingsServices.getRatingMeta = (productID) => {
  return new Promise((resolve, reject) => {
    db.RatingMeta.findOne({ productID }).exec((err, result) => {
      if (err) {
        reject({errorCode:500, Message: Message.DATABASE_ERROR});
      } else if(result){
        resolve(result);
      } else {
        reject({ errorCode:200, Message: Message.NO_DATA });
      }
    });
  })
};

// Get Ratings of a Product
RatingsServices.getRatings = (productID) => {
  return new Promise((resolve, reject) => {
    db.Ratings.find({ productID }).exec((err, result) => {
      if (err) {
        reject({errorCode:500, Message: Message.DATABASE_ERROR});
      } else if(result){
        resolve(result);
      } else {
        reject({ errorCode:200, Message: Message.NO_DATA });
      }
    });
  })
};

module.exports = RatingsServices;
