const express = require("express");
require('dotenv').config();
const MongoStore = require('connect-mongo');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
 
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


// const MOBGO_URl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL;
app.use(express.static(path.join(__dirname, "/public")));


main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });


// app.get("/testlisting",async (req,res)=>{
//  let samplelisting = new Listing({
//     title:"Yashaswi",
//     description:"New villa",
//     price:5000,
//     location:"tisangi",
//     county:"india",
//  });

//  await samplelisting.save();
//  console.log("saved");
//  res.send("successful testing");
// });










async function main() {
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
     secret:"mysecretcode"
    },
    touchAfter:24 *3600,
 });

store.on("error",()=>{
  console.log("error in mongo session store");
});

const sessionOptions={
     store, 
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}; 





app.use(session (sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
   next();
});

// app.get("/demoUser",async(req,res)=>{
//    let fakeUser = new User({
//     email:"abc123@gmail.com",
//     username:"student"
//    });
//    let registeredUser = await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);

// } );

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

//me code add
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//boking routes 
const bookingRoutes = require("./routes/booking");
app.use("/", bookingRoutes);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong!" } = err;
    // next(new ExpressError(status,message));
    res.render("error.ejs", { message });
});

app.listen(9000, () => {
    console.log("listening on port");
});