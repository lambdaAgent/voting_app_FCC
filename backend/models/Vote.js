var mongoose = require("mongoose");

var voteSchema = mongoose.Schema({
	VoteTitle: {type: String, required: true},
	VoteChoices : [
		{
			voteName: {type:String, required: true},
			vote: Number
		}
	],
	created_at: {type: Date, default: Date.now}
});
var Vote = mongoose.model("Vote", voteSchema);

Vote.getAll = function (cb, limit) {
	Vote.find(cb).limit(limit).osrt([['created_at', 'ascending']])
};
Vote.getById = function(id, cb){
	Vote.findById(id, cb);
};
Vote.add = function(vote_obj, cb){
	Vote.create(vote_obj, cb);
};
Vote.update = function(id, update_obj, options, cb){
	var query = {_id: id};
	Vote.findOneAndUpdate(query, update_obj, options, cb);
};
Vote.remove = function(id, cb){
	Vote.findOneAndRemove(id, cb);
}
