/**
 * Created by correnti on 09/01/2016.
 */


define(['./module'], function (directives) {
    'use strict';
    directives.directive('orderPaymentSuccess', ['$templateCache', function($templateCache){
        return {
            replace: true,
            template: $templateCache.get('app/order/partials/order-payment-success.html'),
        }
    }]);
});


