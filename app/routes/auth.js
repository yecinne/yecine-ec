var express = require("express"),
	User = require("../models/user.js"),
	passport = require("passport"),
	Cart = require("../models/cart.js")


var router = express.Router()


router.get("/signup", function(req, res) {

	res.render("auth/signup", {
		err: req.flash("err")
	})
})

router.post("/signup", function(req, res) {
	if (!req.body.name || !req.body.email || !req.body.password) {

		req.flash("err", "name , email and password are required")
		res.redirect("/auth/signup")

	} else {
		var user = new User()
		user.profile.name = req.body.name;
		user.password = req.body.password;
		user.email = req.body.email
		user.profile.picture = user.createAvatar()


		user.save(function(err, data) {

			if (err) {
				req.flash("err", "email already exists")
				res.redirect("/auth/signup")

			} else {
				var cart = new Cart()
				cart.owner = data._id

				cart.save(function(err, c) {
					if (err) throw err;
					console.log(c)
					req.logIn(user, function(err) {
						if (err) throw err;
						else {
							res.redirect("/user/profile")

						}
					})

				})



			}
		})
	}

})



router.post('/login', function(req, res, next) {
		if (!req.body.email || !req.body.password) {
			req.flash("err", "email and password are required")
			res.redirect("/auth/login")
		} else {
			next()
		}


	},
	passport.authenticate('local', {
		successRedirect: '/user/profile', // redirect to the secure profile section
		failureRedirect: 'login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

router.get('/login', function(req, res) {
	if (req.user) return res.redirect("/")
	res.render("auth/login", {
		err: req.flash("err"),
		success: req.flash("success")

	})

});

router.get("/logout", function(req, res) {
	req.logout()
	res.redirect("/")
})


router.get('/facebook',
	passport.authenticate('facebook', { scope : ['email'] }));

router.get('/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/login',
		successRedirect: '/'
	}));




module.exports = router