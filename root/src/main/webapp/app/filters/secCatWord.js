/**
 * Created by correnti on 10/12/2015.
 */

define(['./module'], function (controllers) {
    'use strict';
    controllers.filter('secCatWord', function(){
        return function(text, maxLength) {
            if(text.length > maxLength){
                text = text.substring(0, maxLength - 3) + "...";
            }
            return text;
        };
    })
    ;
});

