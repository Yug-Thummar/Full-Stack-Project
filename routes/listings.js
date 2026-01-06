const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isListingAuthor ,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    // index route
    .get(wrapAsync(listingController.index))
    // new listings add index route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


// create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    // show individual route
    .get(wrapAsync(listingController.showListing))
    // update route
    .put(isLoggedIn, isListingAuthor, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    // delete route
    .delete(isLoggedIn, isListingAuthor, wrapAsync(listingController.deleteListing));


// edit route
router.get("/:id/edit", isLoggedIn, isListingAuthor, wrapAsync(listingController.editNewListing));

module.exports = router;