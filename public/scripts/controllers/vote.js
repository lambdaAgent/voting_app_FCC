'use strict';

angular.module('psJwtApp')
	.controller('VotesCtrl', function ($scope, $http, API_URL, alert, authToken) {
		$scope.getMyPolls = function(){
			var user_slug = authToken.getSlug();
			$http.get(API_URL + "/user/" + user_slug + "/votes")
			 .success(function(votes){
			 	$scope.votes = votes;
			 })
			 .error(function(err){
				alert('danger', 'Sorry',  err.message + '!');
			 })
		};
		$scope.getOne = function(id){
			$scope.whichView = 'getOnePoll';
			$http.get(API_URL+"/vote/" + id).success(function(data) {
				$scope.oneVote = data;
				$scope.totalVotes = data.voteChoices.map(function(item){
					return item.vote;
				}).reduce(function(prev,next){
					return prev + next;
				});
				data.voteChoices.map(function(item){
					var result = ($scope.totalVotes > 0) ? (item.vote/$scope.totalVotes).toFixed(2) * 100 : 0
					item.votePercentage = result.toFixed(2);
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
			$scope.whichView = 'getMyPolls';
			$http.delete(API_URL+"/vote/"+id).success(function(data){
				console.log(data);
				$scope.getPolls();
			}).error(function(err){
				alert('danger', 'Sorry',  err.message + '!');
			});
		};

		$scope.submitPolls = function(){
			var voteTitle = angular.element(document.getElementById("poll_name"));
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
				alert("warning", "Sorry", "Please fill at least two options");
				return;
			}
			var polls = {
				voteTitle: voteTitle[0].value,
				voteChoices: voteArr
			};

			var user_slug = authToken.getSlug();
			$http.post(API_URL+"/vote/user/" + user_slug, polls).success(function(data){
				console.log(data);
				voteTitle[0].value = "";
				for(var i=0; i<options.length; i++){
					options[i].value = "";
				}
			}).error(function(err){
				alert('danger', 'Sorry',  err.message + '!');
			})
		};
	});