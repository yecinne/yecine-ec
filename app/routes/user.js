var express = require("express"),
	User = require("./../models/user.js"),
	multer = require("multer")

	var upload = multer({
	dest: 'public/uploads/'
})


var router = express.Router()


router.get("/edit-profile", function(req, res) {

	res.render("user/edit-profile")
})

router.post("/edit-profile",upload.single("mainimage"), function(req, res) {
	var mainImage

	if (req.file) {
		mainImage = req.file.filename
	} else {
		mainImage = "noimage.jpg"
	}
	User.findOne({_id:req.user._id},function(err,user){
		if(err) throw err
		user.profile.name = req.body.name
		user.profile.address = req.body.address
		user.profile.picture = "/uploads/"+mainImage

			user.save(function(err,data){
				if(err) throw err
					else{
						console.log(data);
						req.flash("success","Successfully edited your profile")
						res.redirect("/user/profile")
					}
			})
	})
	
})

router.get("/profile",function(req,res){
	User.findOne({
		_id:req.user._id
	}).populate("history.item")
	.exec(function(err,user){
		if(err) throw err;
		// console.log(user)
		res.render("user/profile",{
			uuser:user,
			success:req.flash("success")
		})
	})
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/')
}




module.exports = router