const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// New listing form
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// Search listings — must come BEFORE /:id

router.get("/search", wrapAsync(listingController.searchListings));

// Index route — all listings
router.get("/", wrapAsync(listingController.index));

// Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editlistingForm));

// Update and delete listing
router.route("/:id")
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyisting));

// Show listing — always last
router.get("/:id", wrapAsync(listingController.showListing));

module.exports = router;
