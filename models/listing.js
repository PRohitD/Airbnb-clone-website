const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
                set: (v) => v === "" ? "https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" : v,
               
    },
    price: Number,
    location: String,
    country: String,

    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review",
    }
    ], 

     // ✅ Add this
  isBooked: {
    type: Boolean,
    default: false,
  },

    owner:{
           type:Schema.Types.ObjectId,
           ref:"User", 
    },

    //boking 
     bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        }
    ]

},{ timestamps: true });

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
 await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

// Create the model
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;