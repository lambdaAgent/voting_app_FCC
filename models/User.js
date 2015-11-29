var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	name : {type: String, required: true},
	slug: {type: String},
	email : {type: String, required: true},
	password: {type: String, required: true},
	vote: [{ type: mongoose.Schema.Types.ObjectId, ref:"Vote" }],
	joined_at: {type: Date, default: Date.now}

});
var User = mongoose.model("User", userSchema);

userSchema.pre("save", function(next){
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.hash(user.password, bcrypt.genSaltSync(10), null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});

	//
	var date = Date.now();
	var slug = String(date).slice(-7);
	user.slug = user.name + slug.toString();
});

User.genPassword = function(password, next){
	bcrypt.hash(password, bcrypt.genSaltSync(10), null, function(err, hash){
		if(err) return next(err);
		next(hash);
	});
}
User.add = function(newUser){
	User.create(newUser, callback);
};
User.getById = function(id, cb){
	User.findById(id, cb);
};
User.update = function(id, update_obj, options, cb){
	var query = {_id: id};
	User.findOneAndUpdate(query, update_obj, options, cb);
};
User.remove = function(id, cb){
	var query = {_id: id};
	User.remove(query, cb);
}
User.verifyPassword = function (password, userPassword, callback) {
	bcrypt.compare(password, userPassword, callback);
};


