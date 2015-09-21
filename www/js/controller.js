angular.module('starter.controllers', ['ionic'])

.controller('HomeCtrl',['$scope','pouchdb','$ionicModal',function($scope,pouchdb,$ionicModal) {

	$scope.item = {};

	$scope.items = [];

	

	var dbLocal = new PouchDB('testo');
	var dbRemote = new PouchDB('http://localhost:5984/testo');

	dbLocal.allDocs({
		  include_docs: true
		}).then(function (result) {
			console.log('re	var dbLocal = new s is',result.rows);
			for(var i=0;i<result.rows.length;i++){
				var obj = {
					"_id": result.rows[i].doc.id,
					"expense": result.rows[i].doc.expense,
					"amount": result.rows[i].doc.amount
				}
				$scope.items.push(obj);
				$scope.$apply();
			}
			console.log($scope.items);
		}).catch(function (err) {
		  console.log(err);
		});

	dbLocal.replicate.to(dbRemote,{live:true},function(err){
		console.log(err);
	});


	$scope.add = function(){


		var timeStamp = String(new Date().getTime());
		console.log(timeStamp);

		var item = {
			"_id": timeStamp,
			"expense": $scope.item.expense,
			"amount": $scope.item.amount
		};

		dbLocal.put(
			item
		).then(function (response) {
		  $scope.items.push(item);
		  $scope.closeModal();
		}).catch(function (err) {
		  console.log(err);
		});
		
	};


	  $ionicModal.fromTemplateUrl('my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
	    $scope.modal.show();
	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  });


}])

.service('CommonProp', function() {
    var items = [];
 
    return {
        getUser: function() {
            return items;
        },
        setUser: function(value) {
            items.push(value);
        }
    };
})

.factory('pouchdb', function() {
  return new PouchDB('myApp');
});
