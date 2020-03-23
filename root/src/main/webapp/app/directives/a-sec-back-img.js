/**
 * Created by correnti on 27/12/2015.
 */

define(['./module'], function (directives) {
    'use strict';
    directives

        .directive('aSecBackImg', function(){
            return{
                restrict: 'A',
                link: function(s, e, a, ctrl){
                    //  server.catalog.getKey() +
                    e.css('background-image', "url('catalog/fetchImage?image_id=" + a.aSecBackImg + "')")
                }
            }
        });
});

