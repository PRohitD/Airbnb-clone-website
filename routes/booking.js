const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");  // you must create models/booking.js
const Listing = require("../models/listing");

// POST route to handle booking
router.post("/listings/:id/book", async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, guests } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
 
      // ✅ Check if already booked
    if (listing.isBooked) {
      req.flash("error", "Sorry! This listing is already booked.");
      return res.redirect(`/listings/${id}`);
    }

    // create booking
    const newBooking = new Booking({
      listing: listing._id,
      user: req.user._id,
      startDate,
      endDate,
      guests,
    });

    await newBooking.save();

      // ✅ mark listing as booked
    listing.isBooked = true;
    await listing.save();

    req.flash("success", "Booking confirmed!");
    // 👇 redirect to confirmation page
    res.redirect(`/bookings/${newBooking._id}/confirmation`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not create booking!");
    res.redirect("/listings");
  }
});

// GET route to show booking confirmation
router.get("/bookings/:bookingId/confirmation", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate("listing")
      .populate("user");

    if (!booking) {
      req.flash("error", "Booking not found!");
      return res.redirect("/listings");
    }

    res.render("bookings/confirmation", { booking });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

module.exports = router;
