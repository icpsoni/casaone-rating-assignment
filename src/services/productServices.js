const db = require('../models/index');
const ProductServices = {};
const Message = require('../utilities/messages');

// Get Product Details by ID
ProductServices.getProduct = (productID) => {
  return new Promise((resolve, reject) => {
    if(productID) {
      db.Products.findOne({ _id: productID }).exec((err, result) => {
        if (err) {
          reject({errorCode:500, Message: Message.DATABASE_ERROR});
        } else if(result){
          resolve(result);
        } else {
          reject({ errorCode:200, Message: Message.PRODUCT_NOT_FOUND });
        }
      });
    } else {
      reject({errorCode:200, Message: Message.INSUFFICIENT_DATA});
    }
  });
};

module.exports = ProductServices;
