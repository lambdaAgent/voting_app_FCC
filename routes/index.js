var express = require('express');
var router = express.Router();
var debug = require("debug");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var helper = require("./helper/helper.js");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.hbs', { title: 'Express' });
});

//post register -> //must be able to check for double email
router.post("/register", function(req,res, next){
	User.findOne( {email: req.body.email}, function(err, user){
		if (err) { return res.status(404).send(err); }
		if (user) {
			return res.status(401).send( {"message": "email already exists in database"});
		}
		var newUser = new User({
			name : req.body.name,
			email : req.body.email,
			password: req.body.password
		});
		User.create(newUser, function(err, user){
			if(err) {
				return res.status(401).send(err);
			}
			helper.createSendToken(req,res, user, function(err){
				if(err) return res.status(404).send(err);
			});
		});
	});//User.findOne();
});

//post login -> login //must be able to check for email not registered
router.post("/login", function(req,res){
   User.findOne({email: req.body.email}, function(err, user){
   	  	if (err) { return res.status(404).send(err); }
		if (!user) {
			return res.status(401).send( {"message": "email is not registered in database"});
		}
		User.verifyPassword(req.body.password, user.password, function(err, isMatch){
			if(err) return res.status(404).send(err);
			if(!isMatch) return res.status(401).send({"message": "wrong password"});
			helper.createSendToken(req,res, user, function(err){
				if(err) return res.status(404).send(err);
			});
		});
   });
});


router.post("/changePassword", function(req, res, next){
	var user = req.body;
	if(!user.currentPassword || !user.newPassword){
	    console.log("ERROR");
	    return res.status(404).send({"message": "please fill in current and new password"}); 
	}
	helper.authenticateJWT(req, res, function(err){
		if (err) { return res.status(404).send(err); }
		var slug = {"slug": req.body.user_slug};
		User.findOne( slug, function(err, user) {
			if (err) { return res.status(404).send(err); }
			User.verifyPassword(req.body.currentPassword, user.password, function(err, isMatch){
				if (err) { return res.status(404).send(err); }
				if(!isMatch) return res.status(401).send({"message": "wrong password"});
				//if match
				User.genPassword(req.body.newPassword, function(hashedPassword){
					var updatedObject = {password : hashedPassword}
					User.update(user._id, updatedObject, {}, function(err){
						if (err) { return res.status(404).send(err); }
						res.status(200).send({"message": "successfully changed password"});
					})	
				});				
			});
		});
    });
});

// get onePoll -> shows each count

module.exports = router;

var jobs= ["makan"]
router.get("/jobs", function(req, res, next){
	console.log(req.headers);
	helper.authenticateJWT(req, res, function(err){
		if (err) { return res.status(404).send(err); }
		res.json(jobs);
    });
});
