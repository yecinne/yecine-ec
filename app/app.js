var express = require("express"),
	morgan = require("morgan"),
	bodyParser = require("body-parser"),
	ejsMate = require('ejs-mate'),
	flash=require("connect-flash"),
	config=require("./config/config.js"),
	passport=require("passport"),
	Category = require("./models/category.js"),
	Cart = require("./models/cart.js")



var app=express()

app.engine('ejs', ejsMate);
app.set("view engine","ejs")

app.use(require("./session/session.js"))



app.use(morgan("dev"))

app.use(express.static(__dirname+"/../"+"public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended:true
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

require("./auth/auth.js")

app.use(function(req,res,next){
	res.locals.user = req.user;
	res.locals.pageURL = req.url;
	console.log("jkhkjbjn"+req.url)
	next() 
})

app.use(function(req,res,next){
	Category.find({},function(err,data){
		if(err) throw err;
		else{
			res.locals.categs = data;
			next() 
		}
	})
	
})


app.use(function(req,res,next){
	if(req.user){
		var total = 0;
		Cart.findOne({owner : req.user._id},function(err,cart){
			if(err) throw err;
			if(!cart) res.locals.cart = 0;
			else{
				for(var i = 0 ; i < cart.items.length ; i++){
					total += cart.items[i].quantity
				}

				res.locals.cart = total
			}
			next()
		})

	}else{
		next()
	}
	
})


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/auth/login')
}

function isAdmin(req,res,next){
	if(req.isAuthenticated() && req.user.admin){
		return next();
	}
	res.redirect('/')
}

app.use(require("./routes"))
app.use("/auth",require("./routes/auth.js"))
app.use("/user",isLoggedIn,require("./routes/user.js"))
app.use("/admin/category",isAdmin,require("./routes/admin/category.js"))
app.use("/admin/product",isAdmin,require("./routes/admin/product.js"))
app.use("/admin/user",isAdmin,require("./routes/admin/user.js"))
app.use("/product",require("./routes/product.js"))
app.use("/category",require("./routes/category.js"))
app.use("/cart",isLoggedIn,require("./routes/cart.js"))

module.exports = app