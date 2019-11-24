function ProductRatingData(reviewsData, productData) {
  console.log(productData);
  return{
    reviews: reviewsData[1],
    aggregatedRatings: {
      ratingLevels:reviewsData[0].ratingLevels,
      totalReviews: productData.rating.totalReviews,
      totalRatings: productData.rating.totalRatings,
      avgRating: productData.rating.avg.toFixed(1),
    }
  }
}

module.exports = {
  ProductRatingData
};
