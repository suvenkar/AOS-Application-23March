/**
 * Created by correnti on 10/12/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('showLast4DigitsCard', function(){
        return function(num, last) {
            return last ? num + "" : "****" ;
        };
    });
});

