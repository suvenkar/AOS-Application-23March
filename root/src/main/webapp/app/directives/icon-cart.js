/**
 * Created by correnti on 19/01/2016.
 */



define(['./module'], function (directives) {
    'use strict';
    directives.directive('iconCart', function(){
        return{
            restrict: 'A',
            replace: false,
            template: "<div class='iconCart'><div class='iconCartHandle'></div><div class='iconCartTop'></div><div class='iconCartBottom'></div><div></div></div>",
            link: function(s, e, a, ctrl){
                e.addClass("iconCss iconCart");
            }
        }
    });
});

