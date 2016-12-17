/*
 * Admin Dashboard controller
 */
(function() {
  'use strict';
  var controllerModule = angular.module('myApp.controller');

    controllerModule.controller('AdminCtrl', ['$scope', 'getWeatherFactory', '$window', 'getPricingFactory', 'updatePricingFactory', '$uibModal', '$log', function($scope, $window, getWeatherFactory, getPricingFactory, updatePricingFactory, $uibModal, $log) {
    var admin = this;
    this.pageIdentifier = "Admin Dashboard";
    this.panelTitle = 'Adminstration Things';
        this.panelTitle = 'Single Day Rates';
        admin.singleDay = 'partials/edit_pricing_partials/single_day.html';
        admin.rentalGear = 'partials/edit_pricing_partials/rental_gear.html';
        admin.training = 'partials/edit_pricing_partials/training.html';
        admin.specialties = 'partials/edit_pricing_partials/specialties.html';

        // $scope.model = {
        //     name: 'tabs'
        // };
        // $scope.tabs = [
        //     { title:'Dynamic Title 1', content:'Dynamic content 1' },
        //     { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
        // ];

        // TODO category is the thing binging passed in like specialties, need to make a generic Ctrl - line 35 the templateURL needs to changed the file name edit_rates.html

        $scope.editPrice = function (obj, category) {
            $scope.message = "Show Form Button Clicked";
            console.log($scope.message);
            $scope.stuff = obj;
            $scope.category = category + 'Ctrl';

            var modalInstance = $uibModal.open({
                templateUrl: '/partials/modal/edit_single_day_rates.html',
                controller: $scope.category,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    },
                    pricing: function() {
                        return $scope.stuff;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                var data = {};
                var controllers = {SpecialtiesCtrl: 'specialty',
                                   TrainingsCtrl: 'training',
                                   DivingsCtrl: 'diving',
                                   RentalsCtrl: 'rental'};
                var requiredParams = controllers[$scope.category];
                data['id'] = selectedItem.id;
                data[requiredParams] = {title: selectedItem.title,
                                        price: selectedItem.price,
                                        description: selectedItem.description};

                // var data = {id: selectedItem.id,
                //             specialty: {title: selectedItem.title,
                //                        price: selectedItem.price,
                //                       description: selectedItem.description}};
                // $scope.selected = selectedItem;

                // TODO I would really like to make this dynamic UPDATE these posts requests should happen in the modal controller and only exit the modal when the resonse is success.
                // TODO move the below actions into the modal controllers only close if respnose is success
                if($scope.category == 'SpecialtiesCtrl') {
                    updatePricingFactory.updateSpecialtiesPricing(data);
                } else if($scope.category == 'TrainingsCtrl') {
                    updatePricingFactory.updateTrainingsPricing(data);
                } else if($scope.category == 'RentalsCtrl') {
                    updatePricingFactory.updateRentalsPricing(data);
                } else if($scope.category == 'DivingsCtrl') {
                    updatePricingFactory.updateDivingsPricing(data);
                }
                // TODO not sure the above is the right place to do this, but It did make it over to the service updatePricing Service, see notes there - this works accept the callback doesn't work
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        getPricingFactory.getDivingPricing().then(function(response) {
            admin.currentPricingDiving = response;
        });
        getPricingFactory.getTrainingPricing().then(function(response) {
            admin.currentPricingTraining = response;
        });

        getPricingFactory.getRentalPricing().then(function(response) {
            admin.currentPricingRentals = response;
        });

        getPricingFactory.getSpecialtiesPricing().then(function(response) {
            admin.currentPricingSpecialties = response;
        });

        getPricingFactory.getMiscellaneousPricing().then(function(response) {
            var currentPricingMiscellaneous = response;
            admin.parkFee = currentPricingMiscellaneous[0].price;
        });
  }]);
})();
