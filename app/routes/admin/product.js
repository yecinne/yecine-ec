var express = require("express"),
	Product = require("./../../models/product.js"),
	faker = require("faker"),
	Category = require("./../../models/category.js"),
	multer = require("multer")

	var upload = multer({
	dest: 'public/uploads/'
})



var router = express.Router()


router.get("/faker/add/:categoryName", function(req, res) {

	Category.findOne({
		name: req.params.categoryName
	}, function(err, data) {
		if (err) throw err;
		else if (!data) res.json("no category found")
		else {
			for (var i = 0; i < 30; i++) {
				var product = new Product();
				product.category = data._id,
					product.name = faker.commerce.productName()
				product.price = faker.commerce.price()
				product.image = faker.image.image()
				product.save()
			}
			res.send("ok")

		}
	})
})
router.get("/get-products", function(req, res) {
	Product.find({}, function(err, data) {
		if (err) throw err
		else {
			res.render("admin/product/get-products", {
				products:data,
				err: req.flash("err"),
				success: req.flash("success")
			})
		}

	})


})


router.get("/add-product", function(req, res) {

	Category.find({}, function(err, data) {
		if (err) throw err;
		else {
			Product.findOne({
				_id: req.params.id
			}, function(err, dataa) {
				if (err) throw err
				else {
					res.render("admin/product/add-product", {
						categories:data,
						product: dataa,
						err: req.flash("err")

					})
				}

			})
		}
	})

	
})

router.get("/edit-product/:id", function(req, res) {

		Category.find({}, function(err, dataa) {
		if (err) throw err;
		else {
			Product.findOne({_id:req.params.id}, function(err, data) {
		if (err) throw err
		else {
			res.render("admin/product/edit-products", {
				product:data,
		err: req.flash("err"),
		categories:dataa

			})
		}

	})
		}
	})
	


})




router.post("/",upload.single("mainimage"), function(req, res) {
	// console.log(req.body.category)

	if (!req.body.name  || !req.body.price  || !req.body.category ) {

		req.flash("err", "name , price and image are required")
		res.redirect("/admin/product/add-product")

	} else {
			var mainImage

	if (req.file) {
		mainImage = req.file.filename
	} else {
		mainImage = "noimage.jpg"
	}

		var product = new Product()
		product.name = req.body.name
		product.category = req.body.category
		product.price = req.body.price
		product.image = "/uploads/"+mainImage



			product.save(function(err, data) {
				if (err) throw err
				else {
					req.flash("success", "Successfully added")
					res.redirect("/admin/product/get-products")
				}
			})
	}

})

router.post("/edit/:id",upload.single("mainimage"), function(req, res) {
	Product.findOne({_id:req.params.id}, function(err, product) {
		if (err) throw err
		else {
			var mainImage

	if (req.file) {
		mainImage = req.file.filename
	} else {
		mainImage = "noimage.jpg"
	}

			product.name = req.body.name
		product.category = req.body.category
		product.price = req.body.price
		product.image = "/uploads/"+mainImage

			product.save(function(err, data) {
				if (err) {
					req.flash("err", "name already exists")
				res.redirect("/admin/product/edit-product/"+req.params.id)
				}
				else {
					req.flash("success", "Successfully edited")
					res.redirect("/admin/product/get-products")
				}
			})
			
		}

	})
})

router.post("/delete/:id", function(req, res) {
	console.log("pooooost")
	Product.findByIdAndRemove(req.params.id, function(err, data) {
		if (err) throw err
		else {

					req.flash("success", "Successfully deleted")
					res.redirect("/admin/product/get-products")
			
		}

	})
})




module.exports = router