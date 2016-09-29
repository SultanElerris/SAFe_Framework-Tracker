(function() {'use strict';var app = angular.module('piStatus');

	// #----------------------------------# //
	// #----- Service (objectiveSvc) -----# //
	app.factory('objectiveSvc', function ($q, $firebaseArray, userSvc, ngDialog) {

		var objectiveRef = firebase.database().ref('/objectives');




		function _objectiveRef(uid = null) {
			if (uid === null) { return objectiveRef; }
			return objectiveRef.child(uid);
		}



		var _objective = function(objective = null){
			return {
				id: (objective === null) ? null : objective.$id,
				title: (objective === null) ? null : objective.title,
				businessValue:  (objective === null) ? null : objective.businessValue,
				state:  (objective === null) ? null : objective.state,
				type:  (objective === null) ? null : objective.type,
				piId:  (objective === null) ? null : objective.piId,
				orgId:  (objective === null) ? null : objective.orgId,
				teamId:  (objective === null) ? null : objective.teamId,
				piandorg:  (objective === null) ? null : objective.piandorg,
				piandteam:  (objective === null) ? null : objective.piandteam,
			}
		}

		function createObjective(objective) {
			var objectives = $firebaseArray(_objectiveRef());
			return objectives.$add(objective);
		}



		function createObjectiveDialog(selectedPi, selectedTeam, type) {
			var _defer = $q.defer();
			var objective = new _objective();
			var dialog = ngDialog.open({
				template: '/global/modals/create-objective.html',
				closeByDocument: false,
				showClose: false,
				closeByEscape: false,
				closeByNavigation: false,
				data: {
					header: 'Add Objective',
					objective,
					buttons: [{
						title: 'Save',
						cls: 'button',
						icon: 'fa fa-check',
						loading: false,
						action: function(){
							var ctx = userSvc.context().get();
							objective = Object.assign({},
													objective,{
														type: type,
														piId: selectedPi,
														teamId: selectedTeam,
														orgId: ctx.orgId,
														piandorg: `${selectedPi}~~${ctx.orgId}`,
														piandteam: `${selectedPi}~~${selectedTeam}`
													});
							createObjective(objective).then(function(ref){
								console.log(ref);
								objective.id = ref.key;
								_defer.resolve(objective);
								ngDialog.close(dialog.id);
							}, function(error){
								_defer.rejet(error);
							})
						}
					},{
						title: 'Cancel',
						cls: 'button button-default',
						icon: 'fa-times',
						loading: false,
						action: function(){
							_defer.resolve();
							ngDialog.close(dialog.id);
						}
					}]
				}
			});
			return _defer.promise;
		}



		return {
			createObjectiveDialog
		};

	});
	// #--- END Service (objectiveSvc) ---# //
	// #----------------------------------# //

}());
