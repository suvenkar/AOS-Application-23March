/**
 * Created by correnti on 19/01/2016.
 */



define(['./module'], function (directives) {
    'use strict';
    directives.directive('iconUser', function(){
        return{
            restrict: 'A',
            replace: false,
            link: function(s, e, a, ctrl){
                e.addClass("iconCss iconUser");
            }
        }
    });
});

