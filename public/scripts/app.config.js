angular.module('psJwtApp').config(
	function ($urlRouterProvider, $stateProvider, $httpProvider, $authProvider, API_URL, $authProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider

	.state('main', {
		url: '/',
		templateUrl: '/views/main.html'
	})

	.state('register', {
		url: '/register',
		templateUrl: '/views/register.html',
		controller: 'RegisterCtrl'
	})

	.state('login', {
		url: '/login',
		templateUrl: '/views/login.html',
		controller: 'LoginCtrl'
	})
	.state('setting', {
		url: '/setting',
		templateUrl: '/views/setting.html',
		controller: 'SettingCtrl'
	})
	.state('vote', {
		url: '/vote',
		templateUrl: '/views/votes.html',
		controller: 'VotesCtrl'
	})

	.state('logout', {
		url: '/logout',
		controller: 'LogoutCtrl'
	});

	$authProvider.loginUrl = API_URL + '/auth/login';
	$authProvider.signupUrl = API_URL + '/auth/register';

	$authProvider.google({
		clientId: '823250290560-vc2dt216dtnkmj7kjrb2r5fc22g8ibg4.apps.googleusercontent.com',
		url: API_URL + '/auth/google'
	})

	$authProvider.facebook({
		clientId: '698580886903269',
		url: API_URL + 'auth/facebook'
	})

	$httpProvider.interceptors.push('authInterceptor');
})

//.constant('API_URL', 'http://localhost:3000')
.constant('API_URL', 'https://vda-voting-app.herokuapp.com');
.run(function ($window) {
	var params = $window.location.search.substring(1);
	if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
		var code = decodeURIComponent(params.split('=')[1]);
		console.log(code);
		$window.opener.postMessage(code, $window.location.origin);
	}
});