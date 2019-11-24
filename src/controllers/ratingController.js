const ratingController = {};
const db = require('../models/index');
// Response Messages
const Message = require('../utilities/messages');
const ProductServices = require('../services/productServices');
const RatingServices = require('../services/ratingServices');
const ReturnData = require('../utilities/returnData');

//Get Product Rating by ProductID
ratingController.getRatings = (req, res) => {
  let { productID } = req.query;
    ProductServices.getProduct(productID).then(productData => { // Product is available or not in Database
      let ratingMeta = RatingServices.getRatingMeta(productID); // Rating Meta Data
      let ratings = RatingServices.getRatings(productID); // Ratings and Reviews
      Promise.all([
        ratingMeta.catch(err => {
          return err;
        }),
        ratings.catch(err => {
          return err;
        })
      ]).then(reviewsData => {
        res.status(200).json(ReturnData.ProductRatingData(reviewsData, productData));
      }).catch(err => {
        res.status(err.errorCode).json(err.Message);
      });
    }).catch(err => {
      res.status(err.errorCode).json(err.Message);
    });
};

//Add New Product Rating
ratingController.postRating = (req, res) => {
  let { userID, productID, rating } = req.body;
  if ( userID && productID && rating) {   // Checking for minimum required Data
    ProductServices.getProduct(productID).then(productData => { // Product is available or not in Database
      RatingServices.getRating(userID, productID).then(()=>{ // If user Already Reviewed
        let data = { userID, productID, rating };
        let reviewCount = 0; // For Ratings with Review
        if (req.body.reviewHeading && req.body.reviewDescription){
          data.reviewHeading = req.body.reviewHeading;
          data.reviewDescription = req.body.reviewDescription;
          reviewCount = 1;
        }
        const ratingData = new db.Ratings(data);
        // Saving the Rating Data
        ratingData.save((err, ratingData) => {
          if (err) {
            res.status(500).json(Message.DATABASE_ERROR);
          } else {
            res.status(200).json(ratingData);
            // Updating Or Creating Rating Meta in DB
            let ratingCount = {};
            ratingCount["ratingLevels." + rating] = 1;
            RatingServices.updateToRatingMeta(productID, ratingCount);
            // Updating Product Average rating in DB
            let newRatings = {
              avg: ((productData.rating.avg * productData.rating.totalRatings)+rating) / (productData.rating.totalRatings + 1),
              totalRatings: productData.rating.totalRatings + 1,
              totalReviews: productData.rating.totalReviews + reviewCount
            };
            RatingServices.updateToProduct(productID, newRatings);
          }
        });
      }).catch(err => {
        res.status(err.errorCode).json(err.Message);
      });
      }).catch(err => {
        res.status(err.errorCode).json(err.Message);
    });
  } else {
    res.status(400).json(Message.INSUFFICIENT_DATA);
  }
};

// Update User rating
ratingController.updateRating = (req, res) => {
  let { userID, productID, rating } = req.body; // Checking for minimum required Data
  if ( userID && productID && rating) { // Product is available or not in Database
    ProductServices.getProduct(productID).then(productData => {
      let data = { userID, productID, rating };
      let reviewCount = 0; // For updating Review Count
      if (req.body.reviewHeading && req.body.reviewDescription){
        data.reviewHeading = req.body.reviewHeading;
        data.reviewDescription = req.body.reviewDescription;
        reviewCount = 1;
      }
      RatingServices.updateRating(data).then(ratingData => {
        res.status(200).json(Message.RATING_UPDATED);
        // Updating Rating Meta in DB
        let ratingCount = {};
        if(data.rating !== ratingData.rating) { // Update only if old and new rating is different
          ratingCount["ratingLevels." + data.rating] = 1; // New Rating Increment
          ratingCount["ratingLevels." + ratingData.rating] = -1; // Old Rating Decrement
          RatingServices.updateToRatingMeta(productID, ratingCount);
        }
        // Updating Product Average rating in DB
        if(ratingData.reviewHeading && ratingData.reviewDescription){
          reviewCount = 0; //Review Already Exist
        }
        let newRatings = {
          avg: ((productData.rating.avg * productData.rating.totalRatings)+data.rating-ratingData.rating) / (productData.rating.totalRatings),
          totalRatings: productData.rating.totalRatings,
          totalReviews: productData.rating.totalReviews + reviewCount
        };
        RatingServices.updateToProduct(productID, newRatings);
      })
    }).catch(err => {
      res.status(err.errorCode).json(err.Message);
    }).catch(err => {
      res.status(err.errorCode).json(err.Message);
    });
  } else {
    res.status(400).json(Message.INSUFFICIENT_DATA);
  }
};

// Delete User rating
ratingController.deleteRating = (req, res) => {
  let { userID, productID } = req.body;
  if ( userID && productID ) {  // Checking for minimum required Data
    ProductServices.getProduct(productID).then(productData => {
      RatingServices.deleteRating(userID, productID).then(ratingData => {
        res.status(200).json(Message.RATING_DELETED);
        // Updating Rating Meta in DB
        let ratingCount = {};
        ratingCount["ratingLevels." + ratingData.rating] = -1; // Old Rating Decrement
        RatingServices.updateToRatingMeta(productID, ratingCount);
        // Updating Product Avg Rating in DB
        let reviewCount = 0;
        if(ratingData.reviewHeading && ratingData.reviewDescription){
          reviewCount = -1; //Review Already Exist
        }
        let newRatings = {
          avg: ((productData.rating.avg * productData.rating.totalRatings) - ratingData.rating) / (productData.rating.totalRatings - 1),
          totalRatings: productData.rating.totalRatings -1,
          totalReviews: productData.rating.totalReviews + reviewCount
        };
        RatingServices.updateToProduct(productID, newRatings);
      }).catch(err => {
        res.status(err.errorCode).json(err.Message);
      });
    }).catch(err => {
      res.status(err.errorCode).json(err.Message);
    });
  } else {
    res.status(400).json(Message.INSUFFICIENT_DATA);
  }
};

// Exporting Rating Controllers
module.exports = ratingController;
