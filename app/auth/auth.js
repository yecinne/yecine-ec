var	passport=require("passport"),
  User = require("./../models/user.js"),
	Cart = require("../models/cart.js"),
	LocalStrategy   = require('passport-local').Strategy,
	config = require("./../config/config.js"),
  FacebookStrategy   = require('passport-facebook').Strategy




  var auth =function (req , email , password , done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false,req.flash("err","no user found")); }
      if (!user.comparePassword(password)) { return done(null, false,req.flash("err","wrong password")); }
      return done(null, user);
    });
  }

    var authFB =function (accessToken, refreshToken, profile, done)  {
     User.findOne({ 'facebookId' : profile.id }, function(err, user) {
                if (err){
                    return done(err);
                }
                if (user) {
                    // console.log("**found**"+user)
                    return done(null, user); // user found, return that user
                } else {
                    var newUser            = new User();
                    newUser.facebookId    = profile.id; // set the users facebook id                   
                    newUser.profile.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.profile.picture  = "https://graph.facebook.com/"+profile.id+"/picture?type=large"|| ''; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    newUser.save(function(err,data) {
                        if (err) throw err;
                          console.log("saviiiiiiiiiig")

                    var cart = new Cart()
                    cart.owner = data._id

                    cart.save(function(err, c) {
                      if (err) throw err;
                        return done(null, data);
                      

                    })
                    });
                }
            });
      }



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('local',new LocalStrategy(config.local,auth));
  passport.use(new FacebookStrategy(config.fb, authFB));








