const User = require("../models/user.js");

module.exports.rendersignup= (req, res) => {
    res.render("users/signup.ejs");
  };


  module.exports.renderaboutmeform= (req, res) => {
    res.render("users/aboutme.ejs");
  };


module.exports.signupUser=async (req, res) => {
      try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "Welcome to Wanderlust!");
          res.redirect("/listings");
        });

      }
      catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
      }
    };



    module.exports.renderLogin= (req, res) => {
        res.render("users/login.ejs");
      };


      module.exports.login= async (req, res) => {
        req.flash("success", "Welcome back to WanderLust");
        // res.redirect(res.locals.redirectUrl);
        console.log(res.locals.redirectUrl);
         res.redirect("/listings");
      };



      
      module.exports.logout=  (req, res, next) => {
        req.logOut((err) => {
          if (err) {
            next(err);
          }
          req.flash("success", "you are logged out!");
          res.redirect("/listings");
        });
      };