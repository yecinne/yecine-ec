var express = require("express"),
	User = require("./../../models/user.js")

var router = express.Router()

router.get("/", function(req, res) {
	User.find({}, function(err, data) {
		if (err) throw err
		else {
			res.render("admin/user/index", {
				uuserss:data,
				err: req.flash("err"),
				success: req.flash("success")
			})
		}

	})


})

router.post("/delete/:id", function(req, res) {
	console.log("pooooost")
	User.findByIdAndRemove(req.params.id, function(err, data) {
		if (err) throw err
		else {

					req.flash("success", "Successfully deleted")
					res.redirect("/admin/user")
			
		}

	})
})

router.get("/:id", function(req, res) {
	User.findOne({
		_id:req.params.id
	}).populate("history.item")
	.exec(function(err,user){
		if(err) throw err;
		res.render("admin/user/single",{
			uuser:user,
			success:req.flash("success")
		})
	})

})



module.exports = router