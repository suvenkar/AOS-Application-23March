/**
 * Created by correnti on 15/12/2015.
 */

define(['./module'], function (directives) {
    'use strict';
    directives.directive('scrollToTop', ['$templateCache', function ($templateCache) {
        return {
            restrict: 'E',
            replace: 'true',
            template: $templateCache.get('app/partials/scrollToTop.html'),
            link: function (scope, element, attr) {

                element.bind('click', function () {
                    var _this = this;
                    $('body, html').animate({scrollTop: 0}, 1000, function(){
                    });
                    $(_this).find("p").animate({'opacity' : 0}, 500)
                });

                element.bind('mouseover', function () {
                    $(this).find("p").animate({'opacity' : 1}, 200)
                });
            }
        };
    }]);
});