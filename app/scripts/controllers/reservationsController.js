/*
 * Reservations 
 */
(function() {
  'use strict';
  var controllerModule = angular.module('myApp.controller');

  controllerModule.controller('ReservationsCtrl', ['$scope', '$http', '$route', function($scope, $http, $route) {
    var reservation = this;

    reservation.pageIdentifier = "Reservations";
    reservation.panelTitle = 'Book your diving, kim@divegalaxsea.com | 52-987-112-9630';       
    reservation.checkboxModel = false; 
    reservation.user = {
      "firstName": undefined,
      "lastName": undefined,
      "email": undefined,
      "groupSize": undefined,
      "selectedDiving": [],
      "selectedTraining": [],
      "selectedDates": []
    };

    reservation.diving = [
      "2 Tank boat dive",
      "2 Tank Twilight dives",
      "3 Tank boat dive",
      "3 Tank Twilight dives",
      "Beach One 1 tank",
      "Night Dive",
      "Bubble Watching",
      "Private Charter",
      "Private Dive Master"
    ];

    reservation.training = [
      "Scuba Diver Course",
      "Open water Certification",
      "Open Water Certificaiton Plus",
      "Open Water referral",
      "Advanced Adventurer",
      "Advanced Open Water",
      "Master Diver",
      "Scuba Skills Update",
      "Snorkeling",
      "Try Scuba, Beach 1 Tank",
      "Try Scuba, Boat 2 tank"
    ];

    reservation.checkFirst = function() {
      console.log('checkFirst ran');
      reservation.user.selectedDiving.splice(0, reservation.user.selectedDiving.length); 
      reservation.user.selectedDiving.push('guest');
    };
    
    this.getTrainingInfo = function() {
      var url = "http://localhost:3000/trainings"
        $http.get(url).then(function(response) {
          reservation.training = response.data
        });
    }

    this.getDivingInfo = function() {
      var url = "http://localhost:3000/divings"
        $http.get(url).then(function(response) {
          reservation.diving = response.data
        });
    }

    this.getTrainingInfo();
    this.getDivingInfo();

    reservation.twoTank = false;
    
    reservation.reset = function() {
      reservation.user = {};
    };

    reservation.saveData = function() {
      var data = {
        "user": {
          "first_name": reservation.user.firstName,
          "last_name": reservation.user.lastName,
          "email": reservation.user.email,
          "phone": reservation.user.phone,
          "comments": reservation.user.message,
          "vacations_attributes": [
                                    { "dates_array": reservation.user.selectedDates,
                                      "diving_objects": reservation.user.selectedDiving,
                                      "training_objects": reservation.user.selectedTraining
                                    }
                                  ]
        }
      };
      var url = "http://localhost:3000/users";
      //install $log = $log.log('send users information to api for creation')
      $http.post(url, data).success(function(data, status, headers) {

      }).error(function(data, status){
        //errors go here
      });
      console.log(data);
      $route.reload();
    };

    reservation.addDiving = function(diving) {
      reservation.user.selectedDiving.push(diving); 
    };


    reservation.activeDate = null;
    // reservation.activeDate2 = null;
    reservation.selectedDates = [new Date().setHours(0, 0, 0, 0)];
    // reservation.selectedDates2 = [new Date().setHours(0, 0, 0, 0)];
    reservation.type = 'individual';
    
    reservation.removeFromSelected = function(dt) {
      reservation.selectedDates.splice(reservation.selectedDates.indexOf(dt), 1);
    };

    $scope.roles = [
    'guest', 
    'user', 
    'customer', 
    'admin'
  ];
  $scope.user = {
    roles: ['user']
  };
  $scope.checkAll = function() {
    $scope.user.roles = angular.copy($scope.roles);
  };
  $scope.uncheckAll = function() {
    $scope.user.roles = [];
  };
  $scope.checkFirst = function() {
    $scope.user.roles.splice(0, $scope.user.roles.length); 
    $scope.user.roles.push('guest');
  };

  }]);
})();
