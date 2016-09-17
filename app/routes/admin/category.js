var express = require("express"),
	Category = require("./../../models/category.js")

var router = express.Router()

router.get("/get-categories", function(req, res) {
	Category.find({}, function(err, data) {
		if (err) throw err
		else {
			res.render("admin/category/get-categories", {
				categories:data,
				err: req.flash("err"),
				success: req.flash("success")
			})
		}

	})


})


router.get("/add-category", function(req, res) {

	res.render("admin/category/add-category", {
		err: req.flash("err"),
		success: req.flash("success")
	})
})

router.get("/edit-category/:id", function(req, res) {
	Category.findOne({_id:req.params.id}, function(err, data) {
		if (err) throw err
		else {
			res.render("admin/category/edit-categories", {
				category:data,
		err: req.flash("err")

			})
		}

	})


})




router.post("/", function(req, res) {

	if (!req.body.name) {

		req.flash("err", "name is required")
		res.redirect("/admin/category/add-category")

	} else {
		var category = new Category()
		category.name = req.body.name,

			category.save(function(err, data) {
				if (err) throw err
				else {
					req.flash("success", "Successfully added")
					res.redirect("/admin/category/get-categories")
				}
			})
	}

})

router.post("/edit/:id", function(req, res) {
	Category.findOne({_id:req.params.id}, function(err, category) {
		if (err) throw err
		else {

			category.name = req.body.name,

			category.save(function(err, data) {
				if (err) {
					req.flash("err", "name already exists")
				res.redirect("/admin/category/edit-category/"+req.params.id)
				}
				else {
					req.flash("success", "Successfully edited")
					res.redirect("/admin/category/get-categories")
				}
			})
			
		}

	})
})

router.post("/delete/:id", function(req, res) {
	console.log("pooooost")
	Category.findByIdAndRemove(req.params.id, function(err, data) {
		if (err) throw err
		else {

					req.flash("success", "Successfully deleted")
					res.redirect("/admin/category/get-categories")
			
		}

	})
})


module.exports = router