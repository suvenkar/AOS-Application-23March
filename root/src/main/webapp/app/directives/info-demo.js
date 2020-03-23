/**
 * Created by correnti on 03/06/2016.
 */




define(['./module'], function (directives) {
    'use strict';
    directives.directive('infoDemo', function () {
        return {
            restrict: 'E',
            link: function (s, e, a) {
                e.addClass('info-demo');
                var divInner = $("<div></div>");
                divInner.append("<h4>" + a.aTitle + "</h4>");
                divInner.append("<div style='height: 4px;'></div>");
                var paragraphes = JSON.parse(a.aLines);
                for (var i = 0; i < paragraphes.length; i++) {
                    divInner.append("<p class='roboto-light'>" + paragraphes[i] + "</p>");
                }
                e.append(divInner)
            }
        }
    });
});
