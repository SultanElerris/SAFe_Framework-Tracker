(function () {'use strict';
	var app = angular.module('piStatus');

	app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
		// use the HTML5 History API
    $locationProvider.html5Mode(true);

		$stateProvider
      .state('default', {
				url: '/',
				templateUrl: '/routes/login/login.html'
			})
			.state('home', {
				url: '/home',
				templateUrl: '/routes/home/home.html',
				resolve:{
					user: function(authSvc, userSvc){
						return authSvc.auth().$requireSignIn().then(function(){
							return userSvc.getLoggedInUser();
						});
					}
				},
				controller: function($scope, user, storageSvc){
					$scope.user = user;
					storageSvc.save({ key: 'user', data: { uid: user.$id, orgId: user.orgId } })
				}
			})
			.state('organization', {
				url: '/organization',
				templateUrl: '/routes/organization/organization.html',
				resolve:{
					user: function(authSvc, userSvc){
						return authSvc.auth().$requireSignIn().then(function(){
							return userSvc.getLoggedInUser();
						});
					}
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('team-list', {
				url: '/team/list',
				templateUrl: '/routes/team/list.html',
				resolve:{
					user: function(authSvc, userSvc){
						return authSvc.auth().$requireSignIn().then(function(){
							return userSvc.getLoggedInUser();
						});
					}
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('scrum-master-list', {
				url: '/users/list',
				templateUrl: '/routes/users/scrum-masters.html',
				resolve:{
					user: function(authSvc, userSvc){
						return authSvc.auth().$requireSignIn().then(function(){
							return userSvc.getLoggedInUser();
						});
					}
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			// ========================================================== //
	}).run(function($rootScope, $state, authSvc, toastHelp){
		$rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error){
			if (error === "AUTH_REQUIRED") {
				toastHelp.error('Login again to use the application', 'Error');
      	$state.go('default');
    	}
			if (error === "USER_DELETED") {
				toastHelp.error('There is no user record corresponding to this identifier. The user may have been deleted.', 'Error');
				authSvc.deleteUser().then(function(){
					$state.go('default');
				});
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
