(function() {'use strict';angular.module('piStatus')
.controller('DashboardCtrl', function ($rootScope, $scope, $location, objectiveTypeConst, dashboardSvc, programIncrementSvc,objectHelp, toastHelp) {
// #-----------------------------# //
// #------- DashboardCtrl -------# //

	// this is a route controller

	var route = this;
	var param = $location.search().guid;
	var passedGuid = param.split('~~');
	$scope.selectedPi = null;
	$scope.objectives = [];
	$scope.isChecked = false;
	// View Model properties
	route.vm = {
		isLoading: false,
		open: false,
		teams: [],
		doughnuts:{},
		isChecked: false
	};

	programIncrementSvc.getByKey(passedGuid[0]).then(function(pi){
		$scope.selectedPi = pi;
	})

	$scope.$watch('selectedPi', function(val){
		if(val === null) { return; }
		if($scope.objectives.length) { 	$scope.objectives.$destroy(); }
		dashboardSvc.getData($scope.selectedPi.$id).then(function(data){
			route.vm.teams = data.processData;
			var distributionPercentages = dashboardSvc.processPercentages();
			route.vm.doughnuts = distributionPercentages;
			addWatch(data.objectives);
			}, function(error){
			toastHelp.error(error.message,'Error')
		});
	});


	$scope.$watch('isChecked', function(nVal,oVal){
		if(nVal === oVal) { return; }
		$rootScope.$broadcast('simulator',{ is: nVal })
		if(nVal) { toastHelp.info('Simulator Mode is on, 15 secs are equal to 1 day','Info'); }
	});


	function addWatch(objectives){
		$scope.objectives = objectives;
		$scope.objectives.$watch(function(){
			var newData = dashboardSvc.processData();
			var distributionPercentages = dashboardSvc.processPercentages();
			route.vm.doughnuts = distributionPercentages;
			route.vm.teams.forEach(function(team,i){
				objectHelp.assign(team,newData[i]);
			});
		});
	}




	// Actions that can be bound to from the view
	route.go = {
		calcEndDate:programIncrementSvc.calcEndDate
	};

// #----- END DashboardCtrl -----# //
});}());
