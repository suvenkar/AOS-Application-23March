/**
 * Created by correnti on 14/02/2016.
 */




define(['./module'], function (directives) {
    'use strict';
    directives.directive('iconUserSvg', ['$templateCache', function($templateCache){
        return{
            restrict: 'A',
            replace: true,
            template: $templateCache.get('app/partials/icon-user-svg.html'),
        }
    }]);
});
