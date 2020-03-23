/**
 * Created by correnti on 27/12/2015.
 */



define(['./module'], function (directives) {
    'use strict';
    directives.directive('aSecSrc', function(){
        return{
            restrict: 'A',
            link: function(s, e, a, ctrl){

                // ng-src="fetchImage?image_id={{product.imageUrl}}"
                // server.catalog.getKey() +
                e.attr('src', '/fetchImage?image_id=' + a.aSecSrc);
            }
        }
    });
});

