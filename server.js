var app = require("./app/app.js"),
	server = require("http").createServer(app),
	config = require("./app/config/config.js")



	server.listen(config.port,function(err){
		if(err) throw err
			else
		console.log("server listening on port "+config.port)
	})