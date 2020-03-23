/**
 * Created by correnti on 21/01/2016.
 */



define(['./module'], function (directives) {
    'use strict';
    directives.directive('iconHome', function(){
        return{
            restrict: 'A',
            replace: true,
            template: "<div><div class='iconHomeRoof'></div></div>",
            link: function(s, e, a, ctrl){
                e.addClass("iconCss iconHome");
            }
        }
    });
});

