/**
 * Created by kubany on 10/18/2015.
 */
/**
 * Created by kubany on 10/13/2015.
 */
define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('dealCtrl', ['$scope', 'dealService', '$sce', function ($scope, dealService, $sce) {


        $scope.deals = [];
        // I contain the ngModel values for form interaction.
        $scope.form = {
            name: ""
        };
        loadRemoteData();
        loadDealOftheDay();
        function applyRemoteData( deals ) {
            $scope.deals = deals;
            //$scope.subDeals = deals.slice(1);

            //$scope.imageSrc = 'data:image/jpeg;base64,' + deals[0].image;
        }

        function applyDealOfTheDay( deal ) {
            $scope.dealofday = deal;
            //$scope.subDeals = deals.slice(1);

            //$scope.imageSrc = 'data:image/jpeg;base64,' + deals[0].image;
        }

        function loadRemoteData() {
            dealService.getDeals()
                .then(function( deals ) {
                    applyRemoteData( deals );
                });
        }

        function loadDealOftheDay() {

            dealService.getDealOfTheDay()
                .then(function( deal ) {
                    applyDealOfTheDay( deal );
                });
        }

        Helper.forAllPage();

    }]);
});