/**
 * Created by correnti on 27/07/2016.
 */



define(['./module'], function (controllers) {
    'use strict';
controllers.controller('myOrdersCtrl', ['resolveParams',

    function (resolveParams) {

        var vm = this;
        vm.orders = resolveParams.orders;

        vm.getTotalPrice = function(arr){
            var total = 0;
            angular.forEach(arr, function(product){
                total += product.PricePerUnit * product.Quantity;
            });
            return total;
        }

    }]);
});
