var session = require("express-session"),
	mongoose = require("mongoose"),
	MongoStore = require('connect-mongo')(session),
	config = require("./../config/config.js")


module.exports = session({
	secret: config.sessionSecret,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
})