/**
 * Created by correnti on 07/12/2015.
 */

define(['./module'], function (directives) {
    'use strict';
    directives.directive('toolTipCart', ['$templateCache', 'orderService', '$location',
        function ($templateCache, orderService, location) {
        return {
            template: $templateCache.get('app/partials/toolTipCart.html'),
            link: function(s) {
                s.checkout = function(event){
                    if(event)
                    {
                        event.stopPropagation();
                    }
                    if(orderService.userIsLogin())
                    {
                        location.path('/orderPayment');
                    }
                    else{
                        location.path('/login');
                    }
                }
            }
        };
    }]);
});

