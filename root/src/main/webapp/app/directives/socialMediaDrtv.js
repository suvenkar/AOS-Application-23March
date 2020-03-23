/**
 * Created by kubany on 10/26/2015.
 */
define(['./module'], function (directives) {
    'use strict';
    directives.directive('socialMediaDrtv', ['$templateCache', function ($templateCache) {
        return {
            restrict: 'E',
            replace: 'true',
            template: $templateCache.get('app/partials/social-media-tpl.html'),
            controller: function($scope, $element){

            },
            link: function(scope, el, attr) {

            }
        };
    }]);
});