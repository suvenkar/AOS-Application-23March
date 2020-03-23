/**
 * Created by correnti on 25/02/2016.
 */



define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('sortArrayByColorName', function(){
        return function(arr, colors) {
            return colors.sort(function (a, b) {
                return a.name == b.name ? 0 : a.name < b.name ? -1 : 1;
            });
        };
    })
});







