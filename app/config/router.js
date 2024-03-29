(function () {'use strict';
	var app = angular.module('piStatus');

	app.provider('routeSvc', function(){
		this.verifyUser = ['$q', 'authSvc', 'userSvc', function($q, authSvc, userSvc){
			var _defer = $q.defer();
			authSvc.auth().$requireSignIn()
			.then(function(user){
				if(user.email === 'system@gmail.com') { _defer.reject('SYSTEM_USER_NOT_ALLOWED'); }
				return userSvc.getLoggedInUser();
			})
			.then(function(user){
				_defer.resolve(user);
			})
			.catch(function(error){
				_defer.reject(error);
			});
			return _defer.promise;
		}];
		this.$get = function() { return {}; };
	});


	app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, routeSvcProvider) {
		// use the HTML5 History API
    $locationProvider.html5Mode(true);

		$stateProvider
      .state('default', {
				url: '/',
				templateUrl: '/routes/login/login.html'
			})
			.state('forgotpassword', {
				url: '/forgotpassword',
				templateUrl: '/routes/forgotpassword/forgotpassword.html',
			})
			.state('home', {
				url: '/home',
				templateUrl: '/routes/home/home.html',
				resolve:{
					user: routeSvcProvider.verifyUser
				},
				controller: function($scope, user, userSvc){
					$scope.user = user;
					userSvc.context().set(user);
				}
			})
			.state('organization', {
				url: '/organization',
				templateUrl: '/routes/organization/organization.html',
				resolve:{
					user: routeSvcProvider.verifyUser
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('team-list', {
				url: '/team/list',
				templateUrl: '/routes/team/list.html',
				resolve:{
					user: routeSvcProvider.verifyUser
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('scrum-master-list', {
				url: '/users/list',
				templateUrl: '/routes/users/scrum-masters.html',
				resolve:{
					user: routeSvcProvider.verifyUser
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('program-increment-list', {
				url: '/programincrement/list',
				templateUrl: '/routes/setup/programincrement.html',
				resolve:{
					user: routeSvcProvider.verifyUser
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('objectives-list', {
				url: '/objectives/list',
				templateUrl: '/routes/list-objectives/objectives.html',
				resolve:{
					user: routeSvcProvider.verifyUser
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('objectives-list-all-teams', {
				url: '/objectives/all-teams/list',
				templateUrl: '/routes/list-objectives/all-teams.html',
				resolve:{
					user: routeSvcProvider.verifyUser
				},
				controller: function($scope, user){
					$scope.user = user;
				}
			})
			.state('dashboard', {
				url: '/dashboard',
				templateUrl: '/routes/dashboard/dashboard.html',
				resolve:{
					user: function(authSvc){
					 	return authSvc.loginAsSystem();
					},
					verifyLink: function($q, $timeout, $location, userSvc, storageSvc){
						var _defer = $q.defer();
						var param = $location.search().guid;
						if(param){
							var passedGuid = param.split('~~');
							var piId = passedGuid[0];
							var orgId = passedGuid[1];
							var context = userSvc.context().get();
							if(!context){
								storageSvc.save({ key: 'user', data: { orgId: orgId, userRole: 1 } });
							}
							_defer.resolve();
						}else{
							$timeout(function(){ _defer.reject('INVALID_DASHBOARD_LINK') },100)
						}
						return _defer.promise;
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
			if (error === "INVALID_DASHBOARD_LINK") {
				toastHelp.error('Invalid dashboard Link', 'Error');
      	$state.go('default');
    	}
			if (error === "USER_DELETED") {
				toastHelp.error('There is no user record corresponding to this identifier. The user may have been deleted.', 'Error');
				authSvc.deleteUser().then(function(){
					$state.go('default');
				});
			}
			if(error === 'SYSTEM_USER_NOT_ALLOWED'){
				$state.go('default');
			}
		});

		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, error){
			if(toState.name === 'default'){
				firebase.auth().onAuthStateChanged(function(user){
					if(user) { $state.go('home'); }
				});
			}
		});

	})




}());
