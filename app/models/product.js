var mongoose = require("mongoose"),
	config = require("./../config/config.js"),
	mongoosastic = require('mongoosastic')


var productSchema = new mongoose.Schema({
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "category"
	},
	name: String,
	price: Number,
	image: String
})

productSchema.plugin(mongoosastic,{ hosts:[
	config.BONSAI_URL
	] 
})

module.exports = mongoose.model("product", productSchema)

var Product = mongoose.model("product", productSchema)

Product.createMapping(function(err, mapping) {
    if (err) {
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    } else {
        console.log('mapping created!');
        console.log(mapping);
    }
});

	var stream = Product.synchronize(),
	count = 0;

stream.on('data', function(err, doc) {
	count++;
});
stream.on('close', function() {
	console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err) {
	console.log(err);
});