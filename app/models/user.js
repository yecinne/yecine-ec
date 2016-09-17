var mongoose = require("mongoose"),
	bcrypt = require("bcryptjs"),
	config = require("./../config/config.js"),
	crypto = require("crypto")

mongoose.connect(config.dbURI,function(err){
	if(err) throw err;
	console.log("connected to mongodb");
});




var userSchema = new mongoose.Schema({
	email :{
		type:String,
		unique:true,
		lowercase:true
	},
	admin:{
		type:Boolean,
		default:false
	},
	password:String,
	profile:{
		name:String,
		picture:String,
		address:String
	},
	history:
	[
		{
			item:{
				type:mongoose.Schema.Types.ObjectId,
				ref:"product"
			},
			paid:{
				type:Number,
				default:0
			}
		}
	],
	facebookId:String
})

userSchema.pre("save",function(next){
	var that=this
	if(!this.isModified("password")) return next()
		bcrypt.genSalt(10,function(err,salt){
			if(err) return next(err)
				bcrypt.hash(that.password,salt,function(err,hash){
					if(err) return next(err)
						that.password = hash
						next()
				})
		})

})

userSchema.methods.comparePassword = function(password){
	return bcrypt.compareSync(password,this.password)
}

userSchema.methods.createAvatar = function(){
if(!this.size) size=200;
if(!this.email) return "https://gravatar.com/avatar?s="+size+"&d=retro"
var hash = crypto.createHash('md5').update(this.email).digest('hex');
return "http://www.gravatar.com/avatar/"+hash+"?s="+size+"&d=retro"
}



module.exports = mongoose.model("user",userSchema)




