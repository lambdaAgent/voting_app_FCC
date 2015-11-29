var express = require("express");
var router = express.Router();
var debug = require("debug");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Vote = mongoose.model("Vote");

var helper = require("./helper/helper.js");

router.get('/votes', function(req, res){
	helper.authenticateJWT(req, res, function(err){
		Vote.find({}, function(err, votes){
			if (err) return res.status(404).send(err); 
 			res.status(200).json(votes)
		});
	});
});

router.get("/vote/:id", function(req, res){
	//get the vote number too.
	helper.authenticateJWT(req,res, function(err){
		if (err)  return res.status(404).send(err); 
		Vote.getById(req.params.id, function(err, vote){
			if (err)  return res.status(404).send(err); 
			res.status(200).json(vote);
		});
	})
});

router.post("/vote", function(req, res){
	helper.authenticateJWT(req,res, function(err){
		var vote_obj = {
			VoteTitle: req.body.VoteTitle,
			VoteChoices: req.body.VoteChoices
		};
		Vote.create(vote_obj, function(err, vote_added){
			console.log(vote_obj);
			if(err) return res.status(401).send(err);		    
		    return res.status(200).send("successfully added vote");
		});
    });
});

router.delete("/vote/:id", function(req,res){
	console.log("deleting");
	console.log("id: " + req.params.id);
	helper.authenticateJWT(req,res, function(err){
		Vote.remove(req.params.id, function(err){
			if(err) return res.status(404).send(err);
			res.status(200).send("successfully deleted vote");
		});
    });
});


module.exports = router;

