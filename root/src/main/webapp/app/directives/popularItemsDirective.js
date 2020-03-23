/**
 * Created by kubany on 10/14/2015.
 */
define(['./module'], function (directives) {
    'use strict';
    directives.directive('popularItemsDrtv', ['$templateCache', function ($templateCache) {
        return {
            restrict: 'E',
            replace: 'true',
            template: $templateCache.get('app/partials/popular-Items-tpl.html'),
            //templateUrl: 'app/partials/popular-Items-tpl.html',
            scope: {
                popularProducts: '='
            },
            controller: function($scope, $element){
                //$scope.name = $scope.name + "Second ";
            },
            link: function(scope, el, attr) {
                //scope.name = scope.name + "Third ";
                //scope.$watch('popularProducts', function(popularProducts) {
                //    scope.popularProducts = popularProducts;
                //})
            }
        };
    }]);
});