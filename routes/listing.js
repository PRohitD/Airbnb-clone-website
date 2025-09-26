const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../controllers/listing.js");


// New Info
router.get("/new", isLoggedIn, listingController.renderNewForm);



router
    .route("/")
    //Index Route
    .get(wrapAsync(listingController.index))

    //create
    .post(
        isLoggedIn,
        validateListing, wrapAsync(listingController.createnewListing)
    );




//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editlistingForm));



router
    .route("/:id")

    //show Route 
    .get(wrapAsync(listingController.showListing))

    //Update route
    .put(
        isLoggedIn,
        isOwner,
        validateListing, wrapAsync(listingController.updateListing))

    //Delete Route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyisting));





module.exports = router;