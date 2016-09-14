(function () {'use strict';
	var app = angular.module('piStatus');

	app.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
      .state('default', {
				url: '/',
				templateUrl: '/routes/login/login.html'
			})
			.state('home', {
				url: '/home',
				templateUrl: '/routes/home/home.html',
				resolve:{
					currentAuth: function(authSvc){
						return authSvc.auth().$requireSignIn();
					}
				}
			})
			// ========================================================== //
	}).run(function($rootScope, $state, authSvc, toastHelp){
		$rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error){
			if (error === "AUTH_REQUIRED") {
				toastHelp.error('Login again to use the application', 'Error');
      	$state.go('default');
    	}
		});

		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, error){
			if(toState.name === 'default'){
				var user = authSvc.auth().$getAuth();
				if(user) { $state.go('home'); }
			}			
		});

	})




}());
