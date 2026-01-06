const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview ,isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const reviewsControllers = require("../controllers/reviews.js");

// add post review routes
router.post("/",  isLoggedIn,validateReview, wrapAsync(reviewsControllers.addReview));

// delete review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewsControllers.deleteReview));

module.exports = router;