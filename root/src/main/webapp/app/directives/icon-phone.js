/**
 * Created by correnti on 19/01/2016.
 */



define(['./module'], function (directives) {
    'use strict';
    directives.directive('iconPhone', function(){
        return{
            restrict: 'A',
            replace: true,
            template: "<div><div class='iconPhoneInset'></div></div>",
            link: function(s, e, a, ctrl){
                e.addClass("iconCss iconPhone");
            }
        }
    });
});

