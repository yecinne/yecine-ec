var express = require("express"),
	Cart = require("../models/cart.js"),
	User = require("../models/user.js"),
	config = require("../config/config.js"),
	 stripe = require('stripe')(config.stripeTestSecretKey)

	


var router = express.Router()

router.get("/", function(req, res) {
	Cart.
		findOne({
			owner : req.user._id
		})
		.populate("items.item")
		.exec(function(err,cart){
			if(err) throw err;
			res.render("cart/get-cart",{
				cartts:cart,
				success:req.flash("success")
			})
		})

})

router.post("/:productId/edit",function(req,res){
	Cart.findOne({
		owner: req.user._id
	},function(err,cart){
	
	if(err) throw err;


		cart.items.push({
			item: req.params.productId,
			price : parseFloat(req.body.priceValue),
			quantity : parseInt(req.body.quantity)
		})
		// console.log( cart.total)

		cart.total = parseFloat(cart.total) + parseFloat(req.body.priceValue).toFixed(2)/1
		// console.log(typeof cart.total)
		// console.log(typeof parseFloat(req.body.priceValue).toFixed(2))
		// console.log( cart.total)
		// console.log(parseFloat(req.body.priceValue).toFixed(2))

		cart.save(function(err,data){
			if (err) throw err;
			res.redirect("/cart")
		})


	})
})

router.post("/remove/:productId",function(req,res){


	Cart.findOne({
		owner:req.user._id
	},function(err,cart){
		if(err) throw err;

		
		cart.items.pull(String(req.params.productId))
		cart.total = (parseFloat(cart.total) - parseFloat(req.body.priceValue)).toFixed(2)
		console.log(typeof cart.total)
		cart.save(function(err,data){
			if (err) console.log(err); 
			else{
					req.flash("success","successfully removed")
			res.redirect("/cart")
			}
		
		})
		
	})



})

router.post("/payment",function(req,res){
	var stripeToken = req.body.stripeToken;
	var currentCharges = Math.round(req.body.stripeMoney*100);
	stripe.customers.create({
		source:stripeToken
	}).then(function(customer){
		return stripe.charges.create({
			amount:currentCharges,
			currency:"usd",
			customer:customer.id
		})
	}).then(function(charge){
		Cart.findOne({
		owner:req.user._id
	},function(err,cart){
		if(err) throw err;

		User.findOne({
			_id:req.user._id
		},function(err,user){
			if(err) throw err;
			if(user){

				for(var i = 0 ; i< cart.items.length;i++){
					user.history.push({
					item:cart.items[i].item,
					paid:cart.items[i].price
				})
				}

				user.save(function(err){
					if(err) throw err;

					Cart.update({
						owner:user._id
					},{
						$set:{
							items:[],
							total:0
						}
					},function(err,data){
						if (err) throw err;
						res.redirect("/product/get-products")
					})
				})


				
			}
		})
		
		
		
	})
	})

})



module.exports = router