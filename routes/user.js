const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usercontroller = require("../controllers/users.js");


router.get("/signup",usercontroller.rendersignup);

// about me 
router.get("/aboutme",usercontroller.renderaboutmeform);


router.post
  (
    "/signup",
    wrapAsync(usercontroller.signupUser));



router.get("/login",usercontroller.renderLogin);


router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

 usercontroller.login
);


router.get("/logout",usercontroller.logout);


module.exports = router;
