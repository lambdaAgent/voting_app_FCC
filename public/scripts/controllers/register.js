'use strict';

angular.module('psJwtApp').controller('RegisterCtrl', 
	function (API_URL, $scope, $http, authToken, alert, $state) {
	$scope.submit = function () {
		var url = API_URL + "/register";
		var user = {
			name: $scope.name,
			email: $scope.email,
			password: $scope.password
		};
		console.log(user);
		console.log(url);
		$http.post(url, user)
		     .success(function(result){
		     	console.log(result);
		     	authToken.setToken(result.token);
			    $state.go('main');
		     })
		     .error(function(err){
		     	alert("danger", "error", err);
		     });
	};
});