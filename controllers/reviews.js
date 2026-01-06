const Listing = require("../models/listing");
const Review = require("../models/review");

// add post review routes
module.exports.addReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // logic to add review
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currentUser._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${listing._id}`);
}

// delete review route
module.exports.deleteReview = async (req, res)=>{
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
}