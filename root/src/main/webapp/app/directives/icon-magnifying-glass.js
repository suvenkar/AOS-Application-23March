/**
 * Created by correnti on 21/01/2016.
 */




define(['./module'], function (directives) {
    'use strict';
    directives.directive('iconMagnifyingGlass', function(){
        return{
            restrict: 'A',
            replace: false,
            link: function(s, e, a, ctrl){
                e.addClass("iconCss iconMagnifyingGlass");
            }
        }
    });
});

