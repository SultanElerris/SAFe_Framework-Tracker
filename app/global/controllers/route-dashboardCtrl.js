(function() {'use strict';angular.module('piStatus')
.controller('DashboardCtrl', function ($scope, dashboardSvc) {
// #-----------------------------# //
// #------- DashboardCtrl -------# //

	// this is a route controller
	var route = this;
	$scope.selectedPi = null;
	$scope.objectives = [];

	// View Model properties
	route.vm = {
		isLoading: false,
		teams: []
	};


	$scope.$watch('selectedPi', function(val){
		if(val === null) { return; }
		if($scope.objectives.length) { 	$scope.objectives.$destroy(); }
		dashboardSvc.getData($scope.selectedPi).then(function(data){
			route.vm.teams = data.processData;
			addWatch(data.objectives);
		}, function(error){
			toastHelp.error(error.message,'Error')
		});
	});

	function addWatch(objectives){
		$scope.objectives = objectives;
		$scope.objectives.$watch(function(){
			Object.assign(route.vm.teams, dashboardSvc.processData($scope.objectives));
			//route.vm.teams = dashboardSvc.processData($scope.objectives);
		});
	}


	// Actions that can be bound to from the view
	route.go = {
		someAction: function () {
			route.vm.property = 'something';
		}
	};

// #----- END DashboardCtrl -----# //
});}());