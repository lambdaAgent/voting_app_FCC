'use strict';

angular.module('psJwtApp')
	.controller('VotesCtrl', function ($scope, $http, API_URL, alert, authToken) {
		$scope.getPolls = function(){
			$http.get(API_URL + "/votes").success(function(data){
				$scope.votes = data;
				alert("success", "successfully get Polls");
			}).error(function(err){
				alert('danger', 'Sorry', err.message + '!');
			});
		};
		$scope.getOne = function(id){
			$scope.whichView = 'getOnePoll';
			$http.get(API_URL+"/vote/" + id).success(function(data) {
				$scope.oneVote = data;
				$scope.totalVotes = data.VoteChoices.map(function(item){
					return item.vote;
				}).reduce(function(prev,next){
					return prev + next;
				});
				data.VoteChoices.map(function(item){
					item.votePercentage = ($scope.totalVotes > 0) ? (item.vote/$scope.totalVotes).toFixed(2) * 100 : 0
				});
			}).error(function(err){
				alert('danger', 'Sorry',  err.message + '!');
			})
		};
		$scope.moreOptions = function() {
			var options = angular.element(document.getElementById("options-field"));
			var list = '<input type="text" id="options1" class="form-control" placeholder="next options" ng-model="options'+ i + '">';
			var i = 3;
			options.append(list);
			i++;
		};
		$scope.delete = function(id) {
			$http.delete(API_URL+"/vote/"+id).success(function(data){
				console.log(data);
				$scope.getPolls();
			}).error(function(err){
				alert('danger', 'Sorry',  err.message + '!');
			});
		};

		$scope.submitPolls = function(){
			var VoteTitle = angular.element(document.getElementById("poll_name"));
			var options = angular.element(document.getElementById("options-field")).children();
			var voteArr = [];
			for(var i=0; i<options.length; i++){
				var sample = 
				{
					voteName: options[i].value,
					vote: 0
				};
				voteArr.push(sample);
			};
			if (voteArr.length < 2){
				console.log("Please fill");
				alert("warning", "Sorry", "Please fill at least two options");
				return;
			}
			var polls = {
				VoteTitle: VoteTitle[0].value,
				VoteChoices: voteArr
			};


			$http.post(API_URL+"/vote", polls).success(function(data){
				console.log(data);
				VoteTitle[0].value = "";
				for(var i=0; i<options.length; i++){
					options[i].value = "";
				}
			}).error(function(err){
				alert('danger', 'Sorry',  err.message + '!');
			})
		};


		$scope.plusOne = function(vote_id, eachOptions_id){
			$http.put(API_URL+"/vote/" + vote_id + "/options/" + eachOptions_id)
			  .success(function(data){
			  		$scope.getOne(vote_id);
			  }).error(function(err){
				alert('danger', 'Sorry',  err.message + '!');
			});
		};
	});