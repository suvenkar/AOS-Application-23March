define(['./module'], function (directives) {
    'use strict';
    directives.directive('checkHeight', ["$window", function ($window) {
        return {
            restrict: 'A',
            controller: function () {
                var ctrl = this;
                var element;
                var dimensions;
                ctrl.setElement = function (_element, _dimensions) {
                    element = _element;
                    dimensions = _dimensions.split("X");
                    ctrl.updateSizes();
                }

                ctrl.updateSizes = function (){
                    var height = $(element).width() / dimensions[0] * dimensions[1];
                    $(element).height(height);
                }
            },
            link: function (s, e, a, ctrl) {
                ctrl.setElement(e, a.checkHeight);
                angular.element($window).bind("resize", function () {
                    ctrl.updateSizes();
                });
                ctrl.updateSizes();
            }
        }
    }]);
});

