const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");


const{isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//Reviews

//Post route

router.post("/", 
    isLoggedIn ,
    validateReview, 
    wrapAsync(reviewController.createReview));


//post delete route
router.delete("/:reviewId",
    isReviewAuthor,
     wrapAsync(reviewController.deleteReview));

module.exports = router;