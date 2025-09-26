const Listing= require("../models/listing");

module.exports.index=async (req, res) => {

    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });

}




module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
};



module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exists !!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });


};


module.exports.createnewListing=async (req, res, next) => {

        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        await newlisting.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");

    };


module.exports.editlistingForm=async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing does not exists !!");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });

    };

module.exports.updateListing=async (req, res) => {

        let { id } = req.params;
    

        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);

    };

module.exports.destroyisting=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleated!");
    console.log(deletedListing);
    res.redirect("/listings");

};