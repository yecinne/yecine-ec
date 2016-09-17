module.exports = {
	port : process.env.PORT || 3000,
	dbURI : "*********",
	sessionSecret:"*********",
	stripeTestSecretKey :"*********",
	stripeTestPublishableKey:"*********",
	BONSAI_URL:"*********",
	local:{
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
     fb: {
			clientID: "*********",
			clientSecret: "*********",
			callbackURL: "*********",
			profileFields: ['id', 'displayName', 'photos','emails']
		}
}