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
router.put("/vote/:vote_id/options/:eachOptions_id", function(req, res){
	var eachOptions_id = mongoose.Types.ObjectId(req.params.eachOptions_id)
	console.log(eachOptions_id);
	helper.authenticateJWT(req,res, function(err){
		var vote_obj = {
			VoteTitle: req.body.VoteTitle,
			VoteChoices: req.body.VoteChoices
		};
		Vote.getById(req.params.vote_id, function(err, each_vote){
			if(err) return res.status(401).send(err);	
			var newVoteChoices_arr = each_vote.VoteChoices.map(function(item){
				if(item._id == req.params.eachOptions_id){
					item.vote++;
				}
				return item;
			});

			console.log(newVoteChoices_arr);
			Vote.update(req.params.vote_id, {
				$set: { VoteChoices: newVoteChoices_arr}
			}, {}, function(err, data){
			   if(err) return res.status(401).send(err);	
		       return res.status(200).send("successfully added vote");
			})
		});
    });
});

module.exports = router;

