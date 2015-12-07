var express = require("express");
var router = express.Router();
var debug = require("debug");
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Vote = mongoose.model("Vote");

var helper = require("./helper/helper.js");

router.get('/votes', function(req, res){
	Vote.find({}, function(err, votes){
		if (err) return res.status(404).send(err); 
			res.status(200).json(votes)
	});
});

//get one
router.get("/vote/:id", function(req, res){
	//get the vote number too.
	//helper.authenticateJWT(req,res, function(err){
		// if (err)  return res.status(404).send(err); 
		Vote.getById(req.params.id, function(err, vote){
			if (err)  return res.status(404).send(err); 
			res.status(200).json(vote);
		});
	//})
});

//get all votes by the user only
router.get("/user/:user_slug/votes", function(req, res){
	var slug = {"slug": req.params.user_slug};
	//get the vote number too.
	helper.authenticateJWT(req,res, function(err){
		if (err)  return res.status(404).send(err); 
		User.findOne(slug, function(err, user){
			if (err)  return res.status(404).send(err); 
			Vote.find({user: user}, function(err, votes){
				if (err)  return res.status(404).send(err); 
				res.status(200).json(votes);
			})
		});
	})
});

//add Poll
router.post("/vote/user/:user_slug", function(req, res){
	helper.authenticateJWT(req,res, function(err){
		var vote_obj = {
			voteTitle: req.body.voteTitle,
			voteChoices: req.body.voteChoices,
		};
	var slug = {"slug": req.params.user_slug};
		User.findOne(slug, function(err, user){
			vote_obj.user = mongoose.Types.ObjectId(user._id);
		});
		Vote.create(vote_obj, function(err, vote_added){
			if(err) return res.status(401).send(err);
			User.findOneAndUpdate(slug,{$set: {vote:[vote_added]}}, {}, function(err ,user){
				Vote.update(vote_added._id, {$set: {user: user._id}}, {}, function(err, vote) {
					return res.status(200).send("successfully added vote");
				});
			})
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

//addOne to vote
router.put("/vote/:vote_id/options/:eachOptions_id", function(req, res){
	var eachOptions_id = mongoose.Types.ObjectId(req.params.eachOptions_id)
	console.log(eachOptions_id);
	//helper.authenticateJWT(req,res, function(err){
		var vote_obj = {
			voteTitle: req.body.VoteTitle,
			voteChoices: req.body.VoteChoices
		};
		Vote.getById(req.params.vote_id, function(err, each_vote){
			if(err) return res.status(401).send(err);	
			var newVoteChoices_arr = each_vote.voteChoices.map(function(item){
				if(item._id == req.params.eachOptions_id){
					item.vote++;
				}
				return item;
			});
			Vote.update(req.params.vote_id, {
				$set: { voteChoices: newVoteChoices_arr}
			}, {}, function(err, data){
			   if(err) return res.status(401).send(err);	
		       return res.status(200).send("successfully added vote");
			})
		});
    //});
});

module.exports = router;

