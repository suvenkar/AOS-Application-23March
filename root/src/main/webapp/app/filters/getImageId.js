/**
 * Created by correnti on 11/04/2016.
 */


define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('getImageId', function(){
        return function(image) {
            var indexSubString = image.indexOf("##");
            if(indexSubString == -1){
                return image;
            }
            return image.substring(indexSubString + 2);
        };
    });
});


