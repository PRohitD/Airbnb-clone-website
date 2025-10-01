const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const booking = new Booking({
            listing: listing._id,
            user: req.user._id,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
            guests: req.body.guests,
            totalPrice: listing.price * req.body.guests
        });

        await booking.save();
        listing.bookings.push(booking._id);
        await listing.save();

        req.flash("success", "Booking successful!");
        res.redirect(`/bookings/${booking._id}`); // redirect to confirmation page
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while booking.");
        res.redirect("/listings");
    }
};

module.exports.showBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate("listing")
            .populate("user");

        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/listings");
        }

        res.render("bookings/show.ejs", { booking });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching booking.");
        res.redirect("/listings");
    }
};
