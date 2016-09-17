var express = require("express"),
	Product = require("../models/product.js"),
	Category = require("../models/category.js")



var router = express.Router()


router.get("/get-products-by-categories/:categoryId", function(req, res) {
	Product
		.find({
			category: req.params.categoryId
		})
		.populate("category")
		.exec(function(err, data) {
			if (err) throw err
			else {

				// res.json(data)
				res.render("product/category", {
					products: data
				})
			}

		})

})

router.get("/show/:id", function(req, res) {
	Product
		.findOne({
			_id: req.params.id
		})
		.exec(function(err, data) {
			if (err) throw err
			else {

				// res.json(data)
				res.render("product/single", {
					product: data
				})
			}

		})

})

router.get("/search",function(req,res){

if(req.query.q){
	Product.search({
		query_string:{
			query:req.query.q
		}
	},function(err,data){
		if(err) throw err;
		else{

			// res.json(data)
			res.render("product/search-result",{
				query:req.query.q,
				products:data.hits.hits
			})
		}
	})
}



})

router.get("/search-api",function(req,res){
if(req.query.q){
	Product.search({
		query_string:{
			query:req.query.q
		}
	},function(err,data){
		if(err) throw err;
		else{

			// res.json(data)
			res.json(data.hits.hits)
		}
	})
}
else{
	

	Product.search({
		"query" : {
        "match_all" : {}
    }
	},function(err,data){
		if(err) throw err;
		console.log(data)

			res.json({
				data:data.hits.hits,
				empty:true
			})
	})


}



})

router.get("/get-products",function(req,res){
	var perpage = 12;
		var page = req.query.page ? req.query.page : 1
		var start = (page>1) ? (page*perpage-perpage) : 0
		console.log("page:"+page)
		console.log("start:"+start)

		Product.find()
			.skip(start)
			.limit(perpage)
			.populate("category")
			.exec(function(err,products){
				if(err) throw err
					else{
						Product.count().exec(function(err,count){
							if(err) throw err
					else{
						res.render("product/main",{
							products:products,
							pages:Math.ceil(count/perpage),
							page:page
						})
					}
						})
					}
			})

})



module.exports = router




