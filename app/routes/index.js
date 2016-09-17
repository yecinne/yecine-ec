var express = require("express"),
	User = require("./../models/user.js")

var router = express.Router()

router.get("/",function(req,res){
	
		res.redirect("/product/get-products")


	
	
})

router.get("/about",function(req,res){
	res.render("main/about")
})






module.exports = router