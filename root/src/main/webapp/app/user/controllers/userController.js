/**
 * Created by kubany on 11/11/2015.
 */
define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('userController', ['$scope', '$uibModal', '$log', 'ipCookie',
        function ($scope, $uibModal, $log, $cookie) {

            $scope.accountSection = function(){

                $rootScope.userid = null;
                $cookie.remove("userCookie");
            }


        }]);
});