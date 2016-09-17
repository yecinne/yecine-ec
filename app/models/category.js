var mongoose = require("mongoose"),
	config = require("./../config/config.js")

var categorySchema = new mongoose.Schema({
	name :{
		type:String,
		unique:true
	}
})




module.exports = mongoose.model("category",categorySchema)




