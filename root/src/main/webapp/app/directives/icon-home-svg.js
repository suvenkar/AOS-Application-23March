/**
 * Created by correnti on 16/02/2016.
 */


define(['./module'], function (directives) {
    'use strict';
    directives.directive('iconHomeSvg', ['$templateCache', function($templateCache){
        return{
            restrict: 'A',
            replace: true,
            template: $templateCache.get('app/partials/icon-home-svg.html'),
        }
    }]);
});
